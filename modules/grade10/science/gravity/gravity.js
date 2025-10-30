// --- SUPABASE CLIENT ---
// !! PASTE YOUR URL AND KEY HERE !!
const SUPABASE_URL = 'https://akmodsqmyetugbncgmfg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrbW9kc3FteWV0dWdibmNnbWZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MzU0NzksImV4cCI6MjA3NzMxMTQ3OX0.7T_1CzWY56JS2n3LDvnidtzMF-OFndeVSezNo2bbaB8';
const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- STATE ---
let currentQuestionIndex = 0;

// This array is our "story" for Gravity
const questions = [
    {
        question: "What is the force that pulls this apple toward the Earth?",
        answers: ["Magnetism", "Gravity", "Friction"],
        correctIndex: 1
    },
    {
        question: "Who is famous for discovering gravity by seeing an apple fall?",
        answers: ["Einstein", "Galileo", "Newton"],
        correctIndex: 2
    },
    {
        question: "What will happen if I let go of the apple?",
        answers: ["It will float", "It will fall", "It will fly up"],
        correctIndex: 1
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

// Final animation: Make the apple fall
async function runFinalScene() {
    anime({
        targets: '#apple',
        translateY: 240, // Fall to the ground
        duration: 1000,
        easing: 'easeInCubic' // Accelerate as it falls
    });
    
    // Display the final message
    quizArea.innerHTML = '<h2 style="color: green;">That\'s Gravity!</h2>';

    try {
        // 1. Get the logged-in user
        const { data: { user } } = await _supabase.auth.getUser();

        if (user) {
            // 2. Prepare the data to insert
            const newProgress = {
                user_id: user.id,
                module_name: 'gravity' // <-- The only change is here
            };

            // 3. Insert the row into the 'user_progress' table
            const { error } = await _supabase.from('user_progress').insert(newProgress);
            
            if (error) {
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
// This part is identical to your nacl-reaction script
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

function handleAnswer(selectedIndex) {
    const q = questions[currentQuestionIndex];
    const feedbackEl = document.getElementById('quiz-feedback'); 

    if (selectedIndex === q.correctIndex) {
        currentQuestionIndex++; 
        
        // Trigger animations based on which question was just answered
        if (currentQuestionIndex === 1) {
            feedbackEl.textContent = 'Correct! It\'s gravity!';
            runScene2(); // Wiggle the apple
        } else if (currentQuestionIndex === 2) {
            feedbackEl.textContent = 'Correct! It was Newton.';
            runScene2(); // Wiggle again
        } else {
            feedbackEl.textContent = 'Correct! Watch it fall!';
        }
        
        setTimeout(() => {
            loadQuestion(currentQuestionIndex);
        }, 1500); 
        
    } else {
        feedbackEl.textContent = 'Try again!';
        feedbackEl.style.color = 'red';
    }
}

// --- START THE SIMULATION ---
runScene1(); 
loadQuestion(0);