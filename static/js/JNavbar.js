/*
| ------------------------------------------------------------------------------
| JNavbar
| ------------------------------------------------------------------------------
*/
class JNavbar {

    /**
     * Class constructor
     *
     * @access public
     */
    constructor() {
        if ($(".navbar")[0]) {
            this.navbar = Math.round($(".navbar").outerHeight(true));
            if ($(".navbar.fixed-top")[0]) {
                $("body").css("padding-top", this.navbar + "px");
            }
            // Close Navbar when clicked outside
            $_["document"].on("click", function (event) {
                if ($(".navbar .navbar-toggler").attr("aria-expanded") == "true"
                    && $(event.target).closest(".navbar").length === 0) {
                    $('button[aria-expanded="true"]').click();
                }
            });
        }
    }

    /**
     * Navigation Bar Scrolling (navbar -> dark to light)
     *
     * effect("dark-to-light");
     *
     * @param {String} type
     * @access public
     */
    effect(type) {
        var navbar = document.querySelector(".navbar-effect");
        if (type === "dark-to-light" && navbar) {
            var brand       = navbar.querySelector(".navbar-brand");
            var dark_brand  = brand.querySelector(".dark-brand");
            var light_brand = brand.querySelector(".light-brand");
            window.addEventListener("scroll", () => {
                if (window.scrollY > this.navbar) {
                    dark_brand.classList.remove("d-none");
                    light_brand.classList.add("d-none");
                    navbar.classList.remove("navbar-dark");
                    navbar.classList.remove("bg-dark");
                    navbar.classList.add("navbar-light");
                    navbar.classList.add("bg-white");
                } else {
                    light_brand.classList.remove("d-none");
                    dark_brand.classList.add("d-none");
                    navbar.classList.remove("navbar-light");
                    navbar.classList.remove("bg-white");
                    navbar.classList.add("navbar-dark");
                    navbar.classList.add("bg-dark");
                } 
            });
        }
    }
}
