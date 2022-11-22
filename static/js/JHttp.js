/*
| ------------------------------------------------------------------------------
| JHttp
| ------------------------------------------------------------------------------
*/
class JHttp {

    /**
     * Class constructor
     *
     * Assign ajax via CSS class:
     *
     * <a class="ajax" href="/app-route"></a>
     * <form class="ajax" action="/app-route" return="my_function"></form>
     *
     * function my_function(error, response) {
     *     if (!error) {
     *         console.log(response.data);
     *     } else {
     *         console.log(response);
     *     }
     * }
     *
     * @access public
     */
    constructor() {
        $(document).on("click", "a.ajax", function (e) {
            if (e.target.href) {
                $_["http"].request(e.target.href, (error, response) => {
                    $_["document"].html(response.data);
                    $("body").html($("body").html());
                });
            }
            e.preventDefault();
        });
        $(document).on("submit", "form.ajax", function (e) {
            $_["http"].request(e.target.action, $(this).serialize(),
            (error, response) => {
                if ($(this).attr("return")) {
                    response.reset = () => $(this).trigger("reset");
                    window[$(this).attr("return")](error, response);
                } else {
                    $_["document"].html(response.data);
                    $("body").html($("body").html());
                }
            });
            e.preventDefault();
        });
    }

    /**
     * HTTP request via GET
     *
     * const url = "/my/route/here" or "http://domain.ext/query/..."
     * get(url, (error, response) => {
     *     if (!error) {
     *         return console.log(response);
     *     }
     *     console.log(error);
     * });
     *
     * get(url)
     * .then(response => console.log(response))
     * .catch(error => console.log(error));
     *
     * @param {String} url
     * @param {Function} callback
     * @access public
     */
    get(url, callback = null) {
        var options = {};
        try {
            const $url = new URL(url);
            options.baseURL = $url.protocol + "//" + $url.host
            url = url.split(options.baseURL)[1];
        } catch(e) {}
        return axios.create(options)
                    .get(url)
                    .then(response => callback ?
                                      callback(false, response.data) :
                                      response.data)
                    .catch(error => callback ?
                                    callback(true, error.response) :
                                    error.response);
    }

    /**
     * HTTP request - GET | POST
     *
     * => GET
     *
     * request("/app-route", (error, response) => {
     *     if (!error) {
     *         console.log(response.data);
     *     } else {
     *         console.log(response);
     *     }
     * });
     *
     * => POST
     *
     * request("/app-route", "Form data", (error, response) => {
     *     if (!error) {
     *         console.log(response.data);
     *     } else {
     *         console.log(response);
     *     }
     * });
     *
     * @param {String} url
     * @param {String} data
     * @param {Function} callback
     * @access public
     */
    request(url, data = null, callback = null) {
        let type     = "get",
            error    = false,
            response = {};
        if (type_of(data) === "function") {
            callback = data;
            data     = null;
        } else if (type_of(data) === "object") {
            type = "post";
        }
        axios.defaults.headers.common["Ajax"] = true;
        axios[type](url, data).then(res => {
            response = res;
        }).catch(error => {
            response = error.response;
            error    = true;
        }).finally(() => {
            callback(error, response);
        });
    }
}
