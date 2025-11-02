const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- STATE ---
let currentQuestionIndex = 0;
const questions = [
    {
        question: "The Law of Reflection states that the Angle of Incidence is...",
        answers: ["Greater than the Angle of Reflection", "Equal to the Angle of Reflection", "Less than the Angle of Reflection"],
        correctIndex: 1,
        feedback: "Correct! The angles are equal. Let's see this in action."
    },
    {
        question: "An image formed by a plane mirror is always...",
        answers: ["Real and Inverted", "Virtual and Inverted", "Virtual and Erect"],
        correctIndex: 2,
        feedback: "Excellent! The image is virtual (behind the mirror) and erect (upright)."
    }
    // We will add more questions for lenses/concave mirrors later
];

// --- HTML ELEMENTS ---
const quizArea = document.getElementById('quiz-area');
const objectCandle = document.getElementById('object-candle');
const virtualImage = document.getElementById('image-virtual');

// --- ANIMATIONS ---

// A helper function to create and draw a ray
function drawRay(options) {
    const bench = document.getElementById('optical-bench');
    const ray = document.createElement('div');
    ray.classList.add('ray');
    bench.appendChild(ray);

    // Set initial properties
    anime.set(ray, {
        left: options.fromX,
        top: options.fromY,
        width: 0,
        rotate: options.angle,
        transformOrigin: '0 0'
    });

    // Animate the ray
    anime({
        targets: ray,
        width: options.length,
        easing: 'linear',
        duration: 500,
        delay: options.delay || 0
    });
    
    // Return the ray element so we can add classes to it
    return ray;
}

// NEW: Helper function to clear the first scene's elements
function clearReflectionScene() {
    const elements = document.querySelectorAll('.reflection-scene-element');
    
    // Animate fade out, then remove
    anime({
        targets: elements,
        opacity: 0,
        duration: 300,
        easing: 'easeOutQuad',
        complete: () => {
            elements.forEach(el => el.remove());
        }
    });
}

function runReflectionScene() {
    // Get the HTML elements
    const bench = document.getElementById('optical-bench');
    const candle = document.getElementById('object-candle');
    const mirror = document.getElementById('plane-mirror');

    // 1. Get real pixel coordinates
    const benchRect = bench.getBoundingClientRect();
    const candleRect = candle.getBoundingClientRect();
    const mirrorRect = mirror.getBoundingClientRect();

    // 2. Calculate Start and End points
    const startX = (candleRect.left - benchRect.left) + (candleRect.width / 2);
    const startY = (candleRect.top - benchRect.top); 

    const mirrorX = (mirrorRect.left - benchRect.left) + (mirrorRect.width / 2);
    const mirrorY = (mirrorRect.top - benchRect.top) + (mirrorRect.height / 2);

    // 3. Calculate angle and length
    const deltaX = mirrorX - startX;
    const deltaY = mirrorY - startY;
    const incidentAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    const incidentLength = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // 4. Draw Incident Ray
    const incidentRay = drawRay({
        fromX: `${startX}px`,
        fromY: `${startY}px`,
        angle: incidentAngle,
        length: incidentLength,
        delay: 100
    });
    incidentRay.classList.add('reflection-scene-element'); // Add class

    // 5. Draw Reflected Ray
    const reflectedAngle = 180 - incidentAngle;
    const reflectedRay = drawRay({
        fromX: `${mirrorX}px`,
        fromY: `${mirrorY}px`,
        angle: reflectedAngle,
        length: 350,
        delay: 600
    });
    reflectedRay.classList.add('reflection-scene-element'); // Add class

    // 6. Draw the "Normal" line
    const normal = document.createElement('div');
    normal.style.position = 'absolute';
    normal.style.left = `${mirrorX}px`;
    normal.style.top = `${mirrorY - 50}px`;
    normal.style.width = '2px';
    normal.style.height = '100px';
    normal.style.borderLeft = '2px dashed #999';
    normal.style.opacity = 0;
    normal.style.transform = 'translateX(-1px)';
    normal.classList.add('reflection-scene-element'); // Add class
    bench.appendChild(normal);

    anime({
        targets: normal,
        opacity: [0, 0.7],
        duration: 500,
        delay: 600
    });
    
    // 7. Add text labels (with corrected positions)
    const angleIncidence = document.createElement('div');
    angleIncidence.textContent = "Angle of Incidence (i) = ";
    angleIncidence.style.position = 'absolute';
    angleIncidence.style.left = `${mirrorX - 140}px`; // Moved further left
    angleIncidence.style.top = `${mirrorY - 90}px`;  // Moved up
    angleIncidence.style.opacity = 0;
    angleIncidence.style.fontSize = '0.9rem';
    angleIncidence.classList.add('reflection-scene-element'); // Add class
    bench.appendChild(angleIncidence);

    const angleReflection = document.createElement('div');
    angleReflection.textContent = "Angle of Reflection (r)";
    angleReflection.style.position = 'absolute';
    angleReflection.style.left = `${mirrorX + 15}px`; // Adjusted left
    angleReflection.style.top = `${mirrorY - 90}px`; // Moved up
    angleReflection.style.opacity = 0;
    angleReflection.style.fontSize = '0.9rem';
    angleReflection.classList.add('reflection-scene-element'); // Add class
    bench.appendChild(angleReflection);

    anime({
        targets: [angleIncidence, angleReflection],
        opacity: 1,
        duration: 500,
        delay: 1200
    });
}

function runScene1() {
    // Initial animation: fade in the components
    anime({
        targets: ['#object-candle', '#plane-mirror', '#image-virtual'],
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeInOutSine'
    });
    // Set initial opacity for virtual image
    anime.set(virtualImage, { opacity: 0.5 });
}

function runScene2() {
    // This scene demonstrates the law: object distance = image distance
    // We will move the object and image back and forth
    anime({ 
        targets: objectCandle,
        left: ['30%', '20%'], // Move object closer
        direction: 'alternate',
        loop: 2,
        duration: 2000,
        easing: 'easeInOutQuad'
    });

    anime({ 
        targets: virtualImage,
        right: ['30%', '20%'], // Image also moves closer
        direction: 'alternate',
        loop: 2,
        duration: 2000,
        easing: 'easeInOutQuad'
    });

    // --- NEW: Add "Virtual & Erect" text ---
    const bench = document.getElementById('optical-bench');
    const infoText = document.createElement('div');
    infoText.textContent = 'Image is: Virtual & Erect';
    infoText.style.position = 'absolute';
    infoText.style.left = '50%';
    infoText.style.top = '20%'; // Position high up
    infoText.style.transform = 'translateX(-50%)';
    infoText.style.fontSize = '1.1rem';
    infoText.style.fontWeight = 'bold';
    infoText.style.color = '#333';
    infoText.style.opacity = 0;
    infoText.classList.add('scene-2-element'); // Add class for cleanup
    bench.appendChild(infoText);

    // 2. Animate it
    anime({
        targets: infoText,
        opacity: [0, 1],
        duration: 1000,
        delay: 500 // Let the movement start first
    });
    // --- END NEW ---
}

async function runFinalScene() {
    // --- NEW: Clean up scene 2 elements ---
    const scene2Elements = document.querySelectorAll('.scene-2-element');
    scene2Elements.forEach(el => el.remove());
    // --- END NEW ---

    // This is the end of our "Plane Mirror" section
    quizArea.innerHTML = '<h2 style="color: green;">Congratulations! You\'ve mastered Plane Mirrors!</h2><p>Next, we will explore curved mirrors.</p>';

    // --- We can save progress just like before ---
    try {
        const { data: { user } } = await _supabase.auth.getUser();
        if (user) {
            const newProgress = {
                user_id: user.id,
                module_name: 'light-reflection' // New module name
            };
            const { error } = await _supabase.from('user_progress').insert(newProgress);
            if (error) {
                console.warn("Error saving progress (or already completed):", error.message);
            } else {
                console.log("Progress saved!");
            }
        }
    } catch (e) {
        console.error("Error saving progress:", e);
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
 
window.handleAnswer = (selectedIndex) => {
    const q = questions[currentQuestionIndex];
    const feedbackEl = document.getElementById('quiz-feedback');
    const allButtons = document.querySelectorAll('.answer-btn');
    const clickedButton = allButtons[selectedIndex];

    if (selectedIndex === q.correctIndex) {
        // --- CORRECT ---
        feedbackEl.textContent = q.feedback || 'Correct!';
        feedbackEl.style.color = 'green';
        allButtons.forEach(btn => btn.disabled = true);
        clickedButton.classList.add('correct');
        
        // --- Trigger animations based on question ---
        if (currentQuestionIndex === 0) { // After the FIRST question
            runReflectionScene(); 
        } else if (currentQuestionIndex === 1) { // After the SECOND question
            clearReflectionScene(); // <-- NEW: Clean up the old scene
            runScene2();
        }
        
        currentQuestionIndex++; 
        
        setTimeout(() => {
            loadQuestion(currentQuestionIndex);
        }, 3000); // Increased delay to let animation play
        
    } else {
        // --- INCORRECT ---
        feedbackEl.textContent = 'That\'s not it. Try again!';
        feedbackEl.style.color = 'red';
        clickedButton.classList.add('wrong');
        clickedButton.disabled = true;
    }
}

// --- START ---
runScene1();
loadQuestion(0);