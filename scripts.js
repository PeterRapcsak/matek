// Get year and test from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const year = urlParams.get('year');
const test = urlParams.get('test');
const totalQuestions = 9; // Adjust based on your actual number of questions

const container = document.getElementById('allQuestionsContainer');
const navbar = document.getElementById('navbar');
const testTitle = document.getElementById('testTitle');

// Set the test title
if (year && test) {
    testTitle.textContent = `${year}/${test}`;
}

// Scroll handling for navbar
let lastScroll = 0;
window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    if (currentScroll <= 0) {
        // At top of page, always show navbar
        navbar.classList.remove('hidden');
        return;
    }
    
    if (currentScroll > lastScroll && !navbar.classList.contains('hidden')) {
        // Scrolling down
        navbar.classList.add('hidden');
    } else if (currentScroll < lastScroll && navbar.classList.contains('hidden')) {
        // Scrolling up
        navbar.classList.remove('hidden');
    }
    
    lastScroll = currentScroll;
});

// Load all questions
loadAllQuestions();

function loadAllQuestions() {
    for (let i = 1; i <= totalQuestions; i++) {
        createQuestionElement(i);
    }
}

function createQuestionElement(questionNumber) {
    const formattedQuestion = questionNumber.toString();
    
    // Create question container
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-container';
    questionDiv.id = `question-${questionNumber}`;
    
    // Create question header
    const header = document.createElement('div');
    header.className = 'question-header';
    
    // Create question title with the new format "2005/2/1 (counter)"
    const title = document.createElement('h3');
    title.className = 'question-title';
    title.textContent = `${questionNumber}. Feladat`;
    header.appendChild(title);
    
    // Create timer container
    const timerContainer = document.createElement('div');
    timerContainer.className = 'timer-container';
    
    // Create timer display
    const timerDisplay = document.createElement('span');
    timerDisplay.className = 'timer';
    timerDisplay.textContent = '00:00:00';
    timerDisplay.dataset.question = questionNumber;
    timerContainer.appendChild(timerDisplay);
    
    // Create start/stop button
    const startStopBtn = document.createElement('button');
    startStopBtn.className = 'timer-btn';
    startStopBtn.innerHTML = '<i class="fas fa-play"></i>';
    startStopBtn.dataset.question = questionNumber;
    startStopBtn.dataset.running = 'false';
    timerContainer.appendChild(startStopBtn);
    
    // Create reset button
    const resetBtn = document.createElement('button');
    resetBtn.className = 'timer-btn reset';
    resetBtn.innerHTML = '<i class="fas fa-redo"></i>';
    resetBtn.dataset.question = questionNumber;
    timerContainer.appendChild(resetBtn);
    
    header.appendChild(timerContainer);
    questionDiv.appendChild(header);
    
    // Create question image
    const questionImg = document.createElement('img');
    questionImg.className = 'question-image';
    questionImg.src = `${year}_${test}/questions/vantus_hu_erettsegi_emelt_${year}_${test}_${formattedQuestion}.jpg`;
    questionImg.alt = `Question ${year}/${test}/${questionNumber}`;
    questionDiv.appendChild(questionImg);
    
    // Handle image loading errors
    const errorMsg = document.createElement('p');
    errorMsg.className = 'error-message';
    errorMsg.style.display = 'none';
    questionDiv.appendChild(errorMsg);
    
    questionImg.onerror = function() {
        this.style.display = 'none';
        errorMsg.textContent = `Question image not found: ${this.src.split('/').pop()}`;
        errorMsg.style.display = 'block';
    };
    
    // Create solution button
    const solutionBtn = document.createElement('button');
    solutionBtn.className = 'solution-btn';
    solutionBtn.innerHTML = '<i class="fas fa-lightbulb"></i> Show Solution';
    solutionBtn.dataset.question = questionNumber;
    questionDiv.appendChild(solutionBtn);
    
    // Create solution image (hidden by default)
    const solutionImg = document.createElement('img');
    solutionImg.className = 'solution-image';
    solutionImg.src = `${year}_${test}/questions/vantus_hu_erettsegi_emelt_${year}_${test}_${formattedQuestion}j.jpg`;
    solutionImg.alt = `Solution ${year}/${test}/${questionNumber}`;
    solutionImg.dataset.question = questionNumber;
    solutionImg.style.display = 'none';
    questionDiv.appendChild(solutionImg);
    
    // Handle solution image loading errors
    solutionImg.onerror = function() {
        this.style.display = 'none';
    };
    
    // Add click handler for solution button
    solutionBtn.addEventListener('click', function() {
        toggleSolution(questionNumber);
    });
    
    // Add timer functionality
    let timerInterval;
    let seconds = 0, minutes = 0, hours = 0;
    
    startStopBtn.addEventListener('click', function() {
        const isRunning = this.dataset.running === 'true';
        
        if (isRunning) {
            // Stop the timer
            clearInterval(timerInterval);
            this.dataset.running = 'false';
            this.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            // Start the timer
            this.dataset.running = 'true';
            this.innerHTML = '<i class="fas fa-pause"></i>';
            timerInterval = setInterval(function() {
                seconds++;
                if (seconds >= 60) {
                    seconds = 0;
                    minutes++;
                    if (minutes >= 60) {
                        minutes = 0;
                        hours++;
                    }
                }
                
                const display = document.querySelector(`.timer[data-question="${questionNumber}"]`);
                display.textContent = 
                    `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }, 1000);
        }
    });
    
    resetBtn.addEventListener('click', function() {
        clearInterval(timerInterval);
        seconds = 0;
        minutes = 0;
        hours = 0;
        
        const display = document.querySelector(`.timer[data-question="${questionNumber}"]`);
        display.textContent = '00:00:00';
        
        const startStopBtn = document.querySelector(`.timer-btn[data-question="${questionNumber}"]`);
        startStopBtn.dataset.running = 'false';
        startStopBtn.innerHTML = '<i class="fas fa-play"></i>';
    });
    
    container.appendChild(questionDiv);
}


const toggleBtn = document.getElementById("toggleViewBtn");
const questionContainer = document.getElementById("allQuestionsContainer");
const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");
const mainContent = document.querySelector(".main-content");
const hamburgerMenu = document.getElementById("hamburgerMenu");

toggleBtn.addEventListener("click", () => {
    questionContainer.classList.toggle("grid-view");
    toggleBtn.innerHTML = questionContainer.classList.contains("grid-view")
        ? '<i class="fas fa-list"></i> Single View'
        : '<i class="fas fa-th-large"></i> Split View';
});

sidebarToggle.addEventListener("click", () => {
    sidebar.classList.add("collapsed");
    mainContent.classList.add("expanded");
    hamburgerMenu.style.display = "inline-block";
});

hamburgerMenu.addEventListener("click", () => {
    sidebar.classList.remove("collapsed");
    mainContent.classList.remove("expanded");
    hamburgerMenu.style.display = "none";
});



function toggleSolution(questionNumber) {
    const solutionImg = document.querySelector(`.solution-image[data-question="${questionNumber}"]`);
    const solutionBtn = document.querySelector(`.solution-btn[data-question="${questionNumber}"]`);
    
    if (solutionImg.style.display === 'block') {
        solutionImg.style.display = 'none';
        solutionBtn.innerHTML = '<i class="fas fa-lightbulb"></i> Show Solution';
    } else {
        solutionImg.style.display = 'block';
        solutionBtn.innerHTML = '<i class="fas fa-eye-slash"></i> Hide Solution';
    }
}



