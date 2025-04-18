document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const year = urlParams.get('year');
    const test = urlParams.get('test');
    const totalQuestions = 9;

    const container = document.getElementById('allQuestionsContainer');
    const navbar = document.getElementById('navbar');
    const testTitle = document.getElementById('testTitle');
    const totalTimerDisplay = document.getElementById('totalTimer');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    

    //! XXXXXXXXXXXXXXXXXXXXXXXXX  TIME SHIT  XXXXXXXXXXXXXXXXXXXXXXXXXXX//

    if (year && test) {
        testTitle.textContent = `${year}/${test}`;
    }

    let questionTimers = {}; // Stores time for each question
    let questionIntervals = {}; // Stores intervals for each question

    function formatTime(h, m, s) {
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    function updateTotalTimer() {
        let totalSeconds = 0;
        for (let key in questionTimers) {
            const t = questionTimers[key];
            totalSeconds += t.hours * 3600 + t.minutes * 60 + t.seconds;
        }

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        totalTimerDisplay.textContent = `Total Time: ${formatTime(hours, minutes, seconds)}`;
    }

    //! XXXXXXXXXXXXXXXXXXXXXXXXX  görgike / sidebar  XXXXXXXXXXXXXXXXXXXXXXXXXXX//

    let lastScroll = 0;
    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll <= 0) {
            navbar.classList.remove('hidden');
            return;
        }

        if (currentScroll > lastScroll && !navbar.classList.contains('hidden')) {
            navbar.classList.add('hidden');
        } else if (currentScroll < lastScroll && navbar.classList.contains('hidden')) {
            navbar.classList.remove('hidden');
        }

        lastScroll = currentScroll;
    });

    if (hamburgerMenu && sidebar) {
        hamburgerMenu.addEventListener('click', function () {
            console.log("Hamburger menu clicked!");
            sidebar.classList.toggle('active');
        });
    }

    document.addEventListener('click', function (event) {
        if (!sidebar.contains(event.target) && !hamburgerMenu.contains(event.target)) {
            sidebar.classList.remove('active');
        }
    });

    //! XXXXXXXXXXXXXXXXXXXXXXXXX  kerdesek  XXXXXXXXXXXXXXXXXXXXXXXXXXX//


    loadAllQuestions();

    function loadAllQuestions() {
        for (let i = 1; i <= totalQuestions; i++) {
            createQuestionElement(i);
        }
    }

    function createQuestionElement(questionNumber) {
        const formattedQuestion = questionNumber.toString();

        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-container';
        questionDiv.id = `question-${questionNumber}`;

        const header = document.createElement('div');
        header.className = 'question-header';

        const title = document.createElement('h3');
        title.className = 'question-title';
        title.textContent = `Question ${questionNumber}.`;
        header.appendChild(title);

        

        const timerContainer = document.createElement('div');
        timerContainer.className = 'timer-container';

        const timerDisplay = document.createElement('span');
        timerDisplay.className = 'timer';
        timerDisplay.textContent = '00:00:00';
        timerDisplay.dataset.question = questionNumber;
        timerContainer.appendChild(timerDisplay);

        const startStopBtn = document.createElement('button');
        startStopBtn.className = 'timer-btn';
        startStopBtn.innerHTML = '<i class="fas fa-play"></i>';
        startStopBtn.dataset.question = questionNumber;
        startStopBtn.dataset.running = 'false';
        timerContainer.appendChild(startStopBtn);

        const resetBtn = document.createElement('button');
        resetBtn.className = 'timer-btn reset';
        resetBtn.innerHTML = '<i class="fas fa-redo"></i>';
        resetBtn.dataset.question = questionNumber;
        timerContainer.appendChild(resetBtn);

        header.appendChild(timerContainer);
        questionDiv.appendChild(header);

        const questionImg = document.createElement('img');
        questionImg.className = 'question-image';
        questionImg.src = `${year}_${test}/questions/vantus_hu_erettsegi_emelt_${year}_${test}_${formattedQuestion}.jpg`;
        questionImg.alt = `Question ${year}/${test}/${questionNumber}`;
        questionDiv.appendChild(questionImg);

        const errorMsg = document.createElement('p');
        errorMsg.className = 'error-message';
        errorMsg.style.display = 'none';
        questionDiv.appendChild(errorMsg);

        questionImg.onerror = function () {
            this.style.display = 'none';
            errorMsg.textContent = `Question image not found: ${this.src.split('/').pop()}`;
            errorMsg.style.display = 'block';
        };

        const solutionBtn = document.createElement('button');
        solutionBtn.className = 'solution-btn';
        solutionBtn.innerHTML = '<i class="fas fa-lightbulb"></i> Show Solution';
        solutionBtn.dataset.question = questionNumber;
        questionDiv.appendChild(solutionBtn);

        const solutionImg = document.createElement('img');
        solutionImg.className = 'solution-image';
        solutionImg.src = `${year}_${test}/questions/vantus_hu_erettsegi_emelt_${year}_${test}_${formattedQuestion}j.jpg`;
        solutionImg.alt = `Solution ${year}/${test}/${questionNumber}`;
        solutionImg.dataset.question = questionNumber;
        solutionImg.style.display = 'none';
        questionDiv.appendChild(solutionImg);

        solutionImg.onerror = function () {
            this.style.display = 'none';
        };

        solutionBtn.addEventListener('click', function () {
            toggleSolution(questionNumber);
        });

        //! XXXXXXXXXXXXXXXXXXXXXXXXX  Timer logic  XXXXXXXXXXXXXXXXXXXXXXXXXXX//

        questionTimers[questionNumber] = { seconds: 0, minutes: 0, hours: 0 };

        startStopBtn.addEventListener('click', function () {
            const isRunning = this.dataset.running === 'true';

            if (isRunning) {
                clearInterval(questionIntervals[questionNumber]);
                this.dataset.running = 'false';
                this.innerHTML = '<i class="fas fa-play"></i>';
            } else {
                this.dataset.running = 'true';
                this.innerHTML = '<i class="fas fa-pause"></i>';
                questionIntervals[questionNumber] = setInterval(() => {
                    let timer = questionTimers[questionNumber];
                    timer.seconds++;
                    if (timer.seconds >= 60) {
                        timer.seconds = 0;
                        timer.minutes++;
                        if (timer.minutes >= 60) {
                            timer.minutes = 0;
                            timer.hours++;
                        }
                    }
                    timerDisplay.textContent = formatTime(timer.hours, timer.minutes, timer.seconds);
                    updateTotalTimer();
                }, 1000);
            }
        });

        resetBtn.addEventListener('click', function () {
            clearInterval(questionIntervals[questionNumber]);
            questionTimers[questionNumber] = { seconds: 0, minutes: 0, hours: 0 };
            timerDisplay.textContent = '00:00:00';
            startStopBtn.dataset.running = 'false';
            startStopBtn.innerHTML = '<i class="fas fa-play"></i>';
            updateTotalTimer();
        });

        container.appendChild(questionDiv);
    }

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

    //! XXXXXXXXXXXXXXXXXXXXXXXXX  Grid view  XXXXXXXXXXXXXXXXXXXXXXXXXXX//

    const toggleBtn = document.getElementById("toggleViewBtn");
    const questionContainer = document.getElementById("allQuestionsContainer");

    toggleBtn.addEventListener("click", () => {
        questionContainer.classList.toggle("grid-view");
        toggleBtn.innerHTML = questionContainer.classList.contains("grid-view")
            ? '<i class="fas fa-list"></i> Single View'
            : '<i class="fas fa-th-large"></i> Split View';
    });

    const viewSummaryBtn = document.getElementById('viewSummaryBtn');
const summaryOverlay = document.getElementById('summaryOverlay');
const closeSummaryBtn = document.getElementById('closeSummaryBtn');
let timeChart = null;

viewSummaryBtn.addEventListener('click', function() {
    showSummaryPopup();
});

closeSummaryBtn.addEventListener('click', function() {
    summaryOverlay.style.display = 'none';
});

function showSummaryPopup() {
    summaryOverlay.style.display = 'flex';
    renderTimeChart();
}

function renderTimeChart() {
    const ctx = document.getElementById('timeChart').getContext('2d');
    
    // Prepare data for the chart
    const chartData = prepareChartData();
    
    // Destroy previous chart if it exists
    if (timeChart) {
        timeChart.destroy();
    }
    
    timeChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: chartData.labels,
            datasets: [{
                data: chartData.data,
                backgroundColor: chartData.colors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${formatTimeFromSeconds(value)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function prepareChartData() {
    const labels = [];
    const data = [];
    const colors = [
        '#4361ee', '#3f37c9', '#4895ef', '#4cc9f0', '#560bad',
        '#b5179e', '#f72585', '#7209b7', '#3a0ca3', '#4361ee'
    ];
    
    for (let i = 1; i <= totalQuestions; i++) {
        const timer = questionTimers[i];
        const totalSeconds = timer.hours * 3600 + timer.minutes * 60 + timer.seconds;
        
        // Only include questions that have time recorded
        if (totalSeconds > 0) {
            labels.push(`Question ${i}`);
            data.push(totalSeconds);
        }
    }
    
    return {
        labels: labels,
        data: data,
        colors: colors.slice(0, labels.length)
    };
}

function formatTimeFromSeconds(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return formatTime(hours, minutes, seconds);
}

});





