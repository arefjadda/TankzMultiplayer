/**
 * Sends the player's name/handle to the backend.
 */
$(document).ready(() => {
    const form = $("#handleForm");
    const handleInput = $("#handleInput");
    const passwordInput = $("#passwordInput");
    
    form.on("submit", (e) => {
        e.preventDefault();
        const handle = handleInput.val();
        const pwd = passwordInput.val();

        if (handle === '') {
            alert("handle must not be empty");
        } else if (pwd === '') {
            alert("password cannot be empty");
        } else {
            // Get the correct handle
            const data = {
                handle: handle,
                password: pwd
            };

            const request = new Request('/user', {
                method: 'post',
                body: JSON.stringify(data),
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json'
                },
            });

            fetch(request).then((res) => {
                if (res.redirected) {
                    window.location.href = res.url;
                } else {
                    return res.text();
                }
            }).then((clientErr) => {
                if (clientErr) alert(clientErr);
            }).catch((err) => {
                alert('Something went wrong: ' + err.message);
                console.error(err);
            });
            
        }
    });
});