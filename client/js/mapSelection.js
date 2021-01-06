$(document).ready(() => {
    const form = $("#mapSelectionForm");

    form.on("submit", submitForm);
    form.on("click", checkForEnability);
});


function checkForEnability(e) {
    if ($("#maps").val() && $("#tankColors").val()) {
        $("#joinBtn").removeAttr('disabled');
    }
}

function submitForm(e) {
    e.preventDefault();

    const data = {
        selectedMap: $("#maps").val(),
        selectedColor: $("#tankColors").val()
    }

    const request = new Request('/menu', {
        method: 'post',
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json, text/plain',
            'Content-Type': 'application/json'
        },
    });

    fetch(request).then((res) => {
        if (res.status != 200 && res.status != 302) {
            return res.json();
        } else if (res.redirected) {
            return res;
        }
    }).then(data => {
        if (data.message) { // display the error 
            alert(data.message);
        } else { // otherwise redirect
            window.location.href = data.url;
        }
    }).catch((err) => {
        alert('something went wrong!!');
        console.error(err);
    });

}