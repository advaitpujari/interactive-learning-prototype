const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- STATE ---
let currentQuestionIndex = 0;
const questions = [
    {
        question: "How many electrons does Sodium (Na) have in its outer shell?",
        answers: ["7", "1", "8"],
        correctIndex: 1,
        feedback: "Correct! Na wants to give up its 1 electron."
    },
    {
        question: "How many electrons does Chlorine (Cl) need to be stable?",
        answers: ["1", "2", "7"],
        correctIndex: 0,
        feedback: "Correct! Cl needs 1 electron."
    },
    {
        question: "What is this bond called?",
        answers: ["Covalent", "Metallic", "Ionic"],
        correctIndex: 2,
        feedback: "Perfect!"
    }
];

// --- HTML ELEMENTS ---
const quizArea = document.getElementById('quiz-area');

// --- ANIMATIONS ---
function runScene1() {
    anime({
        targets: ['#na-atom', '#cl-atom'],
        translateX: [-100, 0], 
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeInOutSine'
    });
}
function runScene2() {
    anime({ 
        targets: '#na-atom', 
        scale: 1.2, 
        direction: 'alternate', 
        duration: 400,
        easing: 'easeInOutQuad'
    });
}
function runScene3() {
    anime({ 
        targets: '#cl-atom', 
        scale: 1.2, 
        direction: 'alternate', 
        duration: 400,
        easing: 'easeInOutQuad'
    });
}
async function runFinalScene() {
    anime({
        targets: '#na-atom',
        translateX: 50, 
        duration: 1000
    });
    anime({
        targets: '#cl-atom',
        translateX: -50, 
        duration: 1000
    });
    quizArea.innerHTML = '<h2 style="color: green;">Congratulations! You formed an Ionic Bond!</h2>';

    try {
        // 1. Get the logged-in user
        const { data: { user } } = await _supabase.auth.getUser();

        if (user) {
            // 2. Prepare the data to insert
            const newProgress = {
                user_id: user.id,
                module_name: 'nacl-reaction' // This MUST match your unique name
            };

            // 3. Insert the row into the 'user_progress' table
            const { error } = await _supabase.from('user_progress').insert(newProgress);
            
            if (error) {
                // This will fail if they've already completed it (due to our UNIQUE rule),
                // which is fine. We can just log it.
                console.warn("Error saving progress:", error.message);
            } else {
                console.log("Progress saved!");
            }
        }
    } catch (e) {
        console.error("Error getting user or saving progress:", e);
    }
}

// --- QUIZ LOGIC ---
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
        <p id="quiz-feedback"></p>
    `;
    const answersContainer = document.getElementById('answers');
    q.answers.forEach((answer, i) => {
        answersContainer.innerHTML += 
            `<button class="answer-btn" onclick="handleAnswer(${i})">${answer}</button>`;
    });
}
 
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
        
        if (currentQuestionIndex === 1) runScene2();
        else if (currentQuestionIndex === 2) runScene3();
        
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

// --- START ---
runScene1();
loadQuestion(0);