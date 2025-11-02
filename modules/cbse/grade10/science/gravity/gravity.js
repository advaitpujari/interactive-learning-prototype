const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- STATE ---
let currentQuestionIndex = 0;

// This array is our "story" for Gravity
const questions = [
    {
        question: "What is the force that pulls this apple toward the Earth?",
        answers: ["Magnetism", "Gravity", "Friction"],
        correctIndex: 1,
        feedback: "Correct! It's gravity!"
    },
    {
        question: "Who is famous for discovering gravity by seeing an apple fall?",
        answers: ["Einstein", "Galileo", "Newton"],
        correctIndex: 2,
        feedback: "Correct! It was Newton."
    },
    {
        question: "What will happen if I let go of the apple?",
        answers: ["It will float", "It will fall", "It will fly up"],
        correctIndex: 1,
        feedback: "Correct! Watch it fall!"
    }
];

// --- HTML ELEMENTS ---
const quizArea = document.getElementById('quiz-area');
const apple = document.getElementById('apple');

// --- ANIMATIONS ---
function runScene1() {
    // Apple just hangs there
    anime({
        targets: '#apple',
        translateY: 0,
        opacity: [0, 1],
        duration: 1000
    });
}

function runScene2() {
    // Wiggle the apple
    anime({ 
        targets: '#apple', 
        rotate: [-15, 15],
        direction: 'alternate', 
        duration: 300,
        loop: 2,
        easing: 'easeInOutSine'
    });
}

async function runFinalScene() {
    anime({
        targets: '#apple',
        translateY: 240, // Fall to the ground
        duration: 1000,
        easing: 'easeInCubic' // Accelerate as it falls
    });
    
    // Display the final message
    quizArea.innerHTML = '<h2 style="color: green;">That\'s Gravity!</h2>';

    // --- SAVE PROGRESS TO SUPABASE ---
    try {
        const { data: { user } } = await _supabase.auth.getUser();
        if (user) {
            const newProgress = {
                user_id: user.id,
                module_name: 'gravity' 
            };
            const { error } = await _supabase.from('user_progress').insert(newProgress);
            if (error) {
                console.warn("Error saving progress:", error.message);
            } else {
                console.log("Gravity progress saved!");
            }
        }
    } catch (e) {
        console.error("Error saving progress:", e);
    }
}

// --- QUIZ LOGIC (Self-contained) ---

function loadQuestion(index) {
    if (index >= questions.length) {
        runFinalScene();
        return;
    }
    const q = questions[index];
    quizArea.innerHTML = `
        <h3>Quiz ${index + 1}:</h3>
        <p>${q.question}</p>
        <div id="answers"></div>
        <p id="quiz-feedback"></css=>
    `;
    const answersContainer = document.getElementById('answers');
    q.answers.forEach((answer, i) => {
        answersContainer.innerHTML += 
            `<button class="answer-btn" onclick="handleAnswer(${i})">${answer}</button>`;
    });
}


// --- !! NEW UPDATED FUNCTION !! ---
// This MUST be on the window to be callable by 'onclick'
window.handleAnswer = (selectedIndex) => {
    const q = questions[currentQuestionIndex];
    const feedbackEl = document.getElementById('quiz-feedback');
    
    // Get all answer buttons
    const allButtons = document.querySelectorAll('.answer-btn');
    // Get the specific button that was clicked
    const clickedButton = allButtons[selectedIndex];

    if (selectedIndex === q.correctIndex) {
        // --- CORRECT ---
        feedbackEl.textContent = q.feedback || 'Correct!';
        feedbackEl.style.color = 'green';
        
        // Disable ALL buttons
        allButtons.forEach(btn => btn.disabled = true);
        
        // Style the correct button
        clickedButton.classList.add('correct');
        
        // Move to next step
        currentQuestionIndex++; 
        
        // This is your original logic for the gravity scenes
        if (currentQuestionIndex === 1) runScene2();
        else if (currentQuestionIndex === 2) runScene2();
        
        setTimeout(() => {
            loadQuestion(currentQuestionIndex);
        }, 1500); 
        
    } else {
        // --- INCORRECT ---
        feedbackEl.textContent = 'That\'s not it. Try again!';
        feedbackEl.style.color = 'red';
        
        // Style the wrong button and disable it
        clickedButton.classList.add('wrong');
        clickedButton.disabled = true;
    }
}
// --- !! END OF UPDATED FUNCTION !! ---


// --- START ---
runScene1();
loadQuestion(0);