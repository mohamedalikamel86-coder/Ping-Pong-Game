const canvas = document.getElementById('pongCanvas');
        const ctx = canvas.getContext('2d');

        // Game objects
        const paddleWidth = 10;
        const paddleHeight = 80;
        const ballRadius = 8;
        const winScore = 5;

        let playerPaddle = {
            x: 10,
            y: canvas.height / 2 - paddleHeight / 2,
            width: paddleWidth,
            height: paddleHeight,
            dy: 0,
            speed: 6
        };

        let computerPaddle = {
            x: canvas.width - paddleWidth - 10,
            y: canvas.height / 2 - paddleHeight / 2,
            width: paddleWidth,
            height: paddleHeight,
            dy: 0,
            speed: 4.5
        };

        let ball = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            radius: ballRadius,
            dx: 5,
            dy: 5,
            speed: 5
        };

        let score = {
            player: 0,
            computer: 0
        };

        let gameRunning = true;
        let mouseY = canvas.height / 2;
        let keysPressed = {};

        // Event listeners
        document.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseY = e.clientY - rect.top;
        });

        document.addEventListener('keydown', (e) => {
            keysPressed[e.key] = true;
        });

        document.addEventListener('keyup', (e) => {
            keysPressed[e.key] = false;
        });

        // Game functions
        function resetGame() {
            score.player = 0;
            score.computer = 0;
            gameRunning = true;
            resetBall();
            playerPaddle.y = canvas.height / 2 - paddleHeight / 2;
            computerPaddle.y = canvas.height / 2 - paddleHeight / 2;
            updateScore();
        }

        function resetBall() {
            ball.x = canvas.width / 2;
            ball.y = canvas.height / 2;
            ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
            ball.dy = (Math.random() - 0.5) * ball.speed;
        }

        function updatePlayerPaddle() {
            // Mouse control
            if (mouseY > playerPaddle.y - 20 && mouseY < playerPaddle.y + playerPaddle.height + 20) {
                playerPaddle.y += (mouseY - (playerPaddle.y + playerPaddle.height / 2)) * 0.1;
            }

            // Arrow key control
            if (keysPressed['ArrowUp']) {
                playerPaddle.dy = -playerPaddle.speed;
            } else if (keysPressed['ArrowDown']) {
                playerPaddle.dy = playerPaddle.speed;
            } else {
                playerPaddle.dy = 0;
            }

            playerPaddle.y += playerPaddle.dy;

            // Boundary collision for player paddle
            if (playerPaddle.y < 0) {
                playerPaddle.y = 0;
            }
            if (playerPaddle.y + playerPaddle.height > canvas.height) {
                playerPaddle.y = canvas.height - playerPaddle.height;
            }
        }

        function updateComputerPaddle() {
            // AI logic
            const computerCenter = computerPaddle.y + computerPaddle.height / 2;
            const ballCenter = ball.y;

            if (computerCenter < ballCenter - 35) {
                computerPaddle.dy = computerPaddle.speed;
            } else if (computerCenter > ballCenter + 35) {
                computerPaddle.dy = -computerPaddle.speed;
            } else {
                computerPaddle.dy = 0;
            }

            computerPaddle.y += computerPaddle.dy;

            // Boundary collision for computer paddle
            if (computerPaddle.y < 0) {
                computerPaddle.y = 0;
            }
            if (computerPaddle.y + computerPaddle.height > canvas.height) {
                computerPaddle.y = canvas.height - computerPaddle.height;
            }
        }

        function updateBall() {
            ball.x += ball.dx;
            ball.y += ball.dy;

            // Top and bottom wall collision
            if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
                ball.dy = -ball.dy;
                ball.y = Math.max(ball.radius, Math.min(canvas.height - ball.radius, ball.y));
            }

            // Paddle collision detection
            if (
                ball.x - ball.radius < playerPaddle.x + playerPaddle.width &&
                ball.y > playerPaddle.y &&
                ball.y < playerPaddle.y + playerPaddle.height
            ) {
                ball.dx = Math.abs(ball.dx); // Ensure ball moves right
                ball.x = playerPaddle.x + playerPaddle.width + ball.radius;
                
                // Add spin based on where ball hits the paddle
                const hitPos = (ball.y - (playerPaddle.y + playerPaddle.height / 2)) / (playerPaddle.height / 2);
                ball.dy = hitPos * ball.speed;
                
                // Increase ball speed slightly
                ball.dx *= 1.05;
                ball.speed *= 1.02;
            }

            if (
                ball.x + ball.radius > computerPaddle.x &&
                ball.y > computerPaddle.y &&
                ball.y < computerPaddle.y + computerPaddle.height
            ) {
                ball.dx = -Math.abs(ball.dx); // Ensure ball moves left
                ball.x = computerPaddle.x - ball.radius;
                
                // Add spin based on where ball hits the paddle
                const hitPos = (ball.y - (computerPaddle.y + computerPaddle.height / 2)) / (computerPaddle.height / 2);
                ball.dy = hitPos * ball.speed;
                
                // Increase ball speed slightly
                ball.dx *= 1.05;
                ball.speed *= 1.02;
            }

            // Score and ball reset
            if (ball.x < 0) {
                score.computer++;
                updateScore();
                resetBall();
                checkWinCondition();
            }

            if (ball.x > canvas.width) {
                score.player++;
                updateScore();
                resetBall();
                checkWinCondition();
            }
        }

        function updateScore() {
            document.getElementById('playerScore').textContent = score.player;
            document.getElementById('computerScore').textContent = score.computer;
        }

        function checkWinCondition() {
            if (score.player >= winScore) {
                gameRunning = false;
                alert(`🎉 Player Wins! Final Score: ${score.player} - ${score.computer}`);
                resetGame();
            } else if (score.computer >= winScore) {
                gameRunning = false;
                alert(`🤖 Computer Wins! Final Score: ${score.computer} - ${score.player}`);
                resetGame();
            }
        }

        function draw() {
            // Clear canvas
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw center line
            ctx.strokeStyle = '#fff';
            ctx.setLineDash([10, 10]);
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, 0);
            ctx.lineTo(canvas.width / 2, canvas.height);
            ctx.stroke();
            ctx.setLineDash([]);

            // Draw paddles
            ctx.fillStyle = '#fff';
            ctx.fillRect(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height);
            ctx.fillRect(computerPaddle.x, computerPaddle.y, computerPaddle.width, computerPaddle.height);

            // Draw ball
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        function gameLoop() {
            if (gameRunning) {
                updatePlayerPaddle();
                updateComputerPaddle();
                updateBall();
            }
            draw();
            requestAnimationFrame(gameLoop);
        }

        // Start the game
        updateScore();
        gameLoop();