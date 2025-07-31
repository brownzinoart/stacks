<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Try Stacks Library</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 40px 20px;
            background: #FBF7F4;
            margin: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
        }
        h1 {
            font-size: 48px;
            margin-bottom: 20px;
        }
        .big-text {
            font-size: 24px;
            line-height: 1.6;
            margin-bottom: 40px;
        }
        .giant-button {
            background: #4ADE80;
            color: white;
            padding: 30px 60px;
            font-size: 32px;
            border: none;
            border-radius: 20px;
            text-decoration: none;
            display: inline-block;
            margin: 20px 0;
            cursor: pointer;
        }
        .help-text {
            font-size: 20px;
            color: #666;
            margin-top: 40px;
        }
        .phone-only {
            display: none;
        }
        @media (max-width: 768px) {
            .phone-only {
                display: block;
            }
            .desktop-only {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📚 Try Stacks Library</h1>
        
        <p class="big-text">
            Discover your next favorite book with AI recommendations!
        </p>

        <div class="phone-only">
            <a href="/" class="giant-button">
                Open App
            </a>

            <p class="help-text">
                Just tap the big green button!
            </p>
        </div>

        <div class="desktop-only">
            <p class="big-text">
                📱 Please open this page on your phone
            </p>
            <p class="help-text">
                Or scan this code with your phone's camera:
            </p>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://your-app.com/test"
                 alt="QR Code" style="margin: 20px 0;">
        </div>
    </div>

</body>
</html>
