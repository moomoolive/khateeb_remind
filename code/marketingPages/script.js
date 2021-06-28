// utility functions
function redirectToMainApp() {
    return window.location.replace("https://app.khateebs.com")
}

const query = ".benefit-text"
const benefitText = window.document.querySelector(query)

const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add("fade-animation")
        }
    })
})

observer.observe(window.document.querySelector(query))