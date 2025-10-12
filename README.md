<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alves Renovation - Get Your Free Quote</title>
    <style>
        /* Basic Reset & Font */
        body, html {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            background-color: #f4f7f6;
            color: #333;
            line-height: 1.6;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        /* Main Container */
        .container {
            background-color: #ffffff;
            padding: 2.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            width: 100%;
            box-sizing: border-box;
            margin: 20px;
        }

        /* Header */
        .header {
            text-align: center;
            margin-bottom: 2rem;
        }
        .header h1 {
            font-size: 2.2rem;
            color: #1a237e; /* A professional dark blue */
            margin-bottom: 0.5rem;
        }
        .header p {
            font-size: 1.1rem;
            color: #555;
        }

        /* Form Styling */
        .lead-form .form-group {
            margin-bottom: 1.5rem;
        }
        .lead-form label {
            display: block;
            font-weight: bold;
            margin-bottom: 0.5rem;
            color: #444;
        }
        .lead-form input[type="text"],
        .lead-form input[type="email"],
        .lead-form input[type="tel"] {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 1rem;
            box-sizing: border-box;
            transition: border-color 0.3s;
        }
        .lead-form input:focus {
            outline: none;
            border-color: #1a237e;
        }

        /* Button Styling */
        .submit-btn {
            background-color: #28a745; /* A positive green color */
            color: #ffffff;
            border: none;
            padding: 15px 20px;
            font-size: 1.1rem;
            font-weight: bold;
            width: 100%;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s, transform 0.2s;
        }
        .submit-btn:hover {
            background-color: #218838;
            transform: translateY(-2px);
        }

        /* Status Messages */
        #form-status {
            text-align: center;
            margin-top: 1rem;
            font-weight: bold;
            display: none; /* Hidden by default */
        }
        .success {
            color: #28a745;
        }
        .error {
            color: #dc3545;
        }
        
        /* Footer */
        .footer {
            text-align: center;
            margin-top: 2rem;
            font-size: 0.9rem;
            color: #aaa;
        }

    </style>
</head>
<body>

    <div class="container">
        <div class="header">
            <h1>Alves Renovation</h1>
            <p>Transform Your Space. Get a Free, No-Obligation Quote Today!</p>
        </div>

        <form class="lead-form" id="leadForm">
            <div class="form-group">
                <label for="name">Full Name</label>
                <input type="text" id="name" name="name" placeholder="e.g., John Doe" required>
            </div>
            <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" name="email" placeholder="e.g., john.doe@example.com" required>
            </div>
            <div class="form-group">
                <label for="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" placeholder="e.g., (555) 123-4567" required>
            </div>
            <button type="submit" class="submit-btn" id="submitButton">Get My Free Quote</button>
        </form>

        <p id="form-status"></p>

        <div class="footer">
            &copy; 2025 Alves Renovation. All Rights Reserved.
        </div>
    </div>

    <script>
        const form = document.getElementById('leadForm');
        const statusMessage = document.getElementById('form-status');
        const submitButton = document.getElementById('submitButton');

        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent the default form submission

            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            // Sua URL foi inserida aqui:
            const scriptURL = 'https://script.google.com/macros/s/AKfycbzz7dKqVolkLgmv5ea4tjSviIpFymTnECYXR3lXPasLw4Bojdopa4eu1qcdbIFxvi9BPg/exec'; 

            fetch(scriptURL, { 
                method: 'POST', 
                body: new FormData(form)
            })
            .then(response => {
                console.log('Success!', response);
                statusMessage.textContent = 'Thank you! We will contact you shortly.';
                statusMessage.className = 'success';
                statusMessage.style.display = 'block';
                form.reset();
            })
            .catch(error => {
                console.error('Error!', error.message);
                statusMessage.textContent = 'Error! Something went wrong. Please try again.';
                statusMessage.className = 'error';
                statusMessage.style.display = 'block';
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = 'Get My Free Quote';
            });
        });
    </script>

</body>
</html>
