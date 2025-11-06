let secretNumbers = [];
        let currentInput = [];
        let currentSlot = 0;
        let currentAttempt = 1;
        let gameActive = true;
        let maxAttempts = 4;

        // Matrix rain effect
        function createMatrixRain() {
            const matrixRain = document.getElementById('matrixRain');
            const chars = '0123456789ABCDEF';
            
            for (let i = 0; i < 50; i++) {
                const char = document.createElement('div');
                char.className = 'matrix-char';
                char.textContent = chars[Math.floor(Math.random() * chars.length)];
                char.style.left = Math.random() * 100 + '%';
                char.style.animationDuration = (Math.random() * 3 + 2) + 's';
                char.style.animationDelay = Math.random() * 2 + 's';
                matrixRain.appendChild(char);
            }
        }

        function generateSecretNumbers() {
            secretNumbers = [];
            while (secretNumbers.length < 4) {
                let num = Math.floor(Math.random() * 10);
                if (!secretNumbers.includes(num)) {
                    secretNumbers.push(num);
                }
            }
            console.log('Secret Matrix Code:', secretNumbers);
        }

        function updateDisplay() {
            // Update slots with enhanced animations
            for (let i = 0; i < 4; i++) {
                const slot = document.getElementById(`slot${i}`);
                slot.classList.remove('active', 'filled');
                
                if (i < currentInput.length) {
                    slot.textContent = currentInput[i];
                    slot.classList.add('filled');
                    
                    // Add entrance animation
                    slot.style.animation = 'none';
                    slot.offsetHeight; // Trigger reflow
                    slot.style.animation = 'slotFill 0.4s ease forwards';
                } else {
                    slot.textContent = '';
                    if (i === currentSlot && currentInput.length < 4) {
                        slot.classList.add('active');
                    }
                }
            }

            updateUsedNumbers();
            updateStats();
            updateHeartsDisplay();
        }

        function updateUsedNumbers() {
            const numberKeys = document.querySelectorAll('.number-key');
            numberKeys.forEach(key => {
                const number = parseInt(key.dataset.number);
                if (currentInput.includes(number)) {
                    key.classList.add('used');
                } else {
                    key.classList.remove('used');
                }
            });
        }

        function updateStats() {
            document.getElementById('attemptNumber').textContent = currentAttempt;
            document.getElementById('livesLeft').textContent = maxAttempts - currentAttempt + 1;
        }

        function updateHeartsDisplay() {
            const heartsContainer = document.getElementById('heartsContainer');
            const livesLeft = maxAttempts - currentAttempt + 1;
            
            heartsContainer.innerHTML = '';
            for (let i = 0; i < livesLeft; i++) {
                const heart = document.createElement('div');
                heart.className = 'heart';
                heart.textContent = '♥';
                heart.style.animationDelay = (i * 0.2) + 's';
                heartsContainer.appendChild(heart);
            }
        }

        function inputDigit(digit) {
            if (!gameActive || currentInput.length >= 4 || currentInput.includes(digit)) {
                // Add error animation for invalid input
                if (currentInput.includes(digit)) {
                    const key = document.querySelector(`[data-number="${digit}"]`);
                    key.style.animation = 'shake 0.5s ease';
                    setTimeout(() => key.style.animation = '', 500);
                }
                return;
            }
            
            currentInput.push(digit);
            currentSlot++;
            updateDisplay();
            
            // Enhanced haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate([50, 30, 50]);
            }

            // Sound effect simulation with visual feedback
            const key = document.querySelector(`[data-number="${digit}"]`);
            key.style.transform = 'scale(0.95)';
            setTimeout(() => key.style.transform = '', 150);
        }

        function clearInput() {
            if (!gameActive) return;
            
            // Add clear animation
            const slots = document.querySelectorAll('.input-slot');
            slots.forEach((slot, index) => {
                setTimeout(() => {
                    slot.style.animation = 'clearSlot 0.3s ease forwards';
                }, index * 50);
            });
            
            setTimeout(() => {
                currentInput = [];
                currentSlot = 0;
                document.getElementById('resultDisplay').innerHTML = '';
                updateDisplay();
                
                // Reset slot animations
                slots.forEach(slot => {
                    slot.style.animation = '';
                });
            }, 300);
        }

        function submitGuess() {
            if (!gameActive || currentInput.length !== 4) {
                // Shake submit button if invalid
                const submitBtn = document.getElementById('submitBtn');
                submitBtn.style.animation = 'shake 0.5s ease';
                setTimeout(() => submitBtn.style.animation = '', 500);
                return;
            }
            
            showResults(currentInput);
            
            // Check win condition
            if (JSON.stringify(currentInput) === JSON.stringify(secretNumbers)) {
                setTimeout(() => endGame(true), 1500);
                return;
            }

            currentAttempt++;
            
            if (currentAttempt > maxAttempts) {
                setTimeout(() => endGame(false), 1500);
                return;
            }

            // Reset for next guess with enhanced timing
            setTimeout(() => {
                currentInput = [];
                currentSlot = 0;
                document.getElementById('resultDisplay').innerHTML = '';
                updateDisplay();
            }, 2500);
        }

        function showResults(guess) {
            const resultDisplay = document.getElementById('resultDisplay');
            resultDisplay.innerHTML = '';
            
            for (let i = 0; i < 4; i++) {
                const resultCircle = document.createElement('div');
                resultCircle.className = 'result-circle';
                
                if (guess[i] === secretNumbers[i]) {
                    resultCircle.classList.add('result-correct');
                    resultCircle.textContent = '✓';
                } else if (secretNumbers.includes(guess[i])) {
                    resultCircle.classList.add('result-wrong-pos');
                    resultCircle.textContent = '↻';
                } else {
                    resultCircle.classList.add('result-incorrect');
                    resultCircle.textContent = '✗';
                }
                
                resultDisplay.appendChild(resultCircle);
                
                // Enhanced animation timing
                setTimeout(() => {
                    resultCircle.classList.add('show');
                }, i * 300);
            }
        }

        function endGame(won) {
            gameActive = false;
            const gameMessage = document.getElementById('gameMessage');
            const messageTitle = document.getElementById('messageTitle');
            const messageText = document.getElementById('messageText');
            const secretReveal = document.getElementById('secretReveal');
            const secretNumbersDiv = document.getElementById('secretNumbers');
            
            if (won) {
                messageTitle.textContent = '🎉 Matrix Kırıldı!';
                messageTitle.className = 'message-title win-title';
                messageText.textContent = `Neon kodu ${currentAttempt}. denemede çözdünüz! Efsane bir performans!`;
                secretReveal.style.display = 'none';
                
                // Victory screen effects
                document.body.style.animation = 'victoryPulse 2s ease-in-out infinite';
            } else {
                messageTitle.textContent = '💀 Matrix Güvenli';
                messageTitle.className = 'message-title lose-title';
                messageText.textContent = 'Neon kodu kırılamadı. Matrix korundu... Tekrar dene!';
                
                secretReveal.style.display = 'block';
                secretNumbersDiv.innerHTML = '';
                secretNumbers.forEach((num, index) => {
                    const numberDiv = document.createElement('div');
                    numberDiv.className = 'secret-number';
                    numberDiv.textContent = num;
                    numberDiv.style.animationDelay = (index * 0.1) + 's';
                    secretNumbersDiv.appendChild(numberDiv);
                });
            }
            
            gameMessage.style.display = 'flex';
            
            // Enhanced haptic feedback
            if (navigator.vibrate) {
                if (won) {
                    navigator.vibrate([200, 100, 200, 100, 200]);
                } else {
                    navigator.vibrate([500, 200, 500]);
                }
            }
        }

        function restartGame() {
            // Reset all game state
            secretNumbers = [];
            currentInput = [];
            currentSlot = 0;
            currentAttempt = 1;
            gameActive = true;

            // Reset visual effects
            document.body.style.animation = '';
            
            // Hide message with animation
            const gameMessage = document.getElementById('gameMessage');
            const messageContent = gameMessage.querySelector('.message-content');
            messageContent.style.animation = 'messageSlideOut 0.5s ease forwards';
            
            setTimeout(() => {
                gameMessage.style.display = 'none';
                messageContent.style.animation = '';
                
                // Clear displays
                document.getElementById('resultDisplay').innerHTML = '';

                // Initialize new game
                generateSecretNumbers();
                updateDisplay();
            }, 500);
        }

        // Enhanced keyboard support
        document.addEventListener('keydown', function(e) {
            if (!gameActive) return;
            
            if (e.key >= '0' && e.key <= '9') {
                inputDigit(parseInt(e.key));
            } else if (e.key === 'Backspace' || e.key === 'Delete') {
                clearInput();
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                submitGuess();
            } else if (e.key === 'Escape') {
                restartGame();
            }
        });

        // Add CSS animations dynamically
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slotFill {
                0% { transform: scale(0) rotate(180deg); opacity: 0; }
                50% { transform: scale(1.2) rotate(90deg); opacity: 0.7; }
                100% { transform: scale(1) rotate(0deg); opacity: 1; }
            }
            
            @keyframes clearSlot {
                0% { transform: scale(1) rotate(0deg); opacity: 1; }
                100% { transform: scale(0) rotate(-180deg); opacity: 0; }
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            
            @keyframes victoryPulse {
                0%, 100% { filter: hue-rotate(0deg) brightness(1); }
                50% { filter: hue-rotate(180deg) brightness(1.2); }
            }
            
            @keyframes messageSlideOut {
                from { transform: translateY(0) scale(1); opacity: 1; }
                to { transform: translateY(-100px) scale(0.8); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        // Prevent zoom on double tap for mobile
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function (event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // Enhanced mobile experience
        if ('ontouchstart' in window) {
            // Add touch ripple effect
            document.addEventListener('touchstart', function(e) {
                if (e.target.classList.contains('number-key') || e.target.classList.contains('control-btn')) {
                    const ripple = document.createElement('div');
                    ripple.style.position = 'absolute';
                    ripple.style.borderRadius = '50%';
                    ripple.style.background = 'rgba(255, 255, 255, 0.3)';
                    ripple.style.transform = 'scale(0)';
                    ripple.style.animation = 'ripple 0.6s linear';
                    ripple.style.left = (e.touches[0].clientX - e.target.getBoundingClientRect().left - 25) + 'px';
                    ripple.style.top = (e.touches[0].clientY - e.target.getBoundingClientRect().top - 25) + 'px';
                    ripple.style.width = ripple.style.height = '50px';
                    
                    e.target.appendChild(ripple);
                    setTimeout(() => ripple.remove(), 600);
                }
            });
            
            // Add ripple animation
            const rippleStyle = document.createElement('style');
            rippleStyle.textContent = `
                @keyframes ripple {
                    to { transform: scale(2); opacity: 0; }
                }
            `;
            document.head.appendChild(rippleStyle);
        }

        // Initialize game
        document.addEventListener('DOMContentLoaded', function() {
            createMatrixRain();
            generateSecretNumbers();
            updateDisplay();
            
            // Add loading animation
            document.body.style.opacity = '0';
            setTimeout(() => {
                document.body.style.transition = 'opacity 1s ease';
                document.body.style.opacity = '1';
            }, 100);
        });

        // Performance optimization: Reduce matrix rain on low-end devices
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            const matrixChars = document.querySelectorAll('.matrix-char');
            matrixChars.forEach((char, index) => {
                if (index % 2 === 0) char.remove();
            });
        }
