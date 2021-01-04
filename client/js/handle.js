$(document).ready(() => {
    const form = $("#handleForm");
    const handleInput = $("#handleInput");
    
    form.on("submit", (e) => {
        e.preventDefault();
        const handle = handleInput.val();
        if (handle === '') {
            alert("handle must not be empty");
        } else {
            // Get the correct handle
            const data = {
                handle: handle,
            };

            const request = new Request('/handle', {
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
                }
            }).catch((err) => {
                alert('something went wrong!');
                console.error(err);
            });
            
        }
    });
});