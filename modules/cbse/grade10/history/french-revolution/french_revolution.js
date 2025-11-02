const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- STATE ---
let currentQuestionIndex = 0;
const sceneText = document.getElementById('scene-text');

// This is our "story" for the French Revolution
const questions = [
    {
        question: "In what year did the French Revolution begin?",
        answers: ["1776", "1789", "1812"],
        correctIndex: 1,
        feedback: "Correct! It started in 1789."
    },
    {
        question: "What was the name of the famous prison stormed by revolutionaries?",
        answers: ["The Bastille", "Alcatraz", "Tower of London"],
        correctIndex: 0,
        feedback: "Excellent! The Storming of the Bastille."
    },
    {
        question: "What was the new execution device used during the 'Reign of Terror'?",
        answers: ["The Longbow", "The Cannon", "The Guillotine"],
        correctIndex: 2,
        feedback: "That's right. It was a dark period."
    }
];

// --- ANIMATIONS (Text-based) ---
function animateText(newText) {
    anime.timeline({
        easing: 'easeInOutSine'
    })
    .add({
        targets: sceneText,
        opacity: 0,
        duration: 500,
        complete: () => { sceneText.textContent = newText; } // Change text when invisible
    })
    .add({
        targets: sceneText,
        opacity: 1,
        duration: 500,
        delay: 100
    });
}

function runScene1() {
    animateText("The people of Paris were unhappy...");
}

function runScene2() {
    animateText("...so they stormed the Bastille prison!");
}

function runScene3() {
    animateText("This led to the 'Reign of Terror'.");
}

async function runFinalScene() {
    animateText("Vive la France! You've completed the module.");
    quizArea.innerHTML = '<h2 style="color: green;">Module Complete!</h2>';

    // --- SAVE PROGRESS TO SUPABASE ---
    try {
        const { data: { user } } = await _supabase.auth.getUser();
        if (user) {
            const newProgress = {
                user_id: user.id,
                module_name: 'french-revolution' // <-- CHANGED MODULE NAME
            };
            const { error } = await _supabase.from('user_progress').insert(newProgress);
            if (error) {
                console.warn("Error saving progress:", error.message);
            } else {
                console.log("History progress saved!");
            }
        }
    } catch (e) {
        console.error("Error saving progress:", e);
    }
}

// --- QUIZ LOGIC (Self-contained) ---
const quizArea = document.getElementById('quiz-area');

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