/*
| ------------------------------------------------------------------------------
| class Datagrid - http://tabulator.info
| ------------------------------------------------------------------------------
| var columns = [
|   {title: "ID", field: "id", width: 80},
|   {title: "User", field: "username"}
| ];
|
| // http://tabulator.info/docs/5.0/filter
| var select = function (option) {
|     switch (option) {
|       case "value-1":
|         datagrid.filter("field_name", "=", 1);
|         break;
|       case "value-2":
|         datagrid.filter("field_name", "=", 2);
|         break;
|       case "value-3":
|         datagrid.filter("field_name", "=", 3);
|     }
| };
|
| var datagrid = new Datagrid("#datagrid", columns, select);
| ==============================================================================
| HTML
| ==============================================================================
| <form action="/url/to/get/data/json" id="datagrid">
|
|   <select>
|     <option selected disabled hidden>Filter by:</option>
|     <optgroup label="User">
|       <option value="verified-1">Verified</option>
|       <option value="verified-0">Not verified</option>
|     </optgroup>
|   </select>
|
|   <button type="reset">
|     <i class="fa fa-sync-alt mx-2" aria-hidden="true"></i>
|   </button>
|
|   <input type="text" name="term">
|
|   <button type="submit">
|     <i class="fa fa-search mx-2"></i>
|   </button>
|
| </form>
| ------------------------------------------------------------------------------
*/
class Datagrid {

    /**
     * Class constructor
     *
     * @param {String} id
     * @param {Object} columns
     * @param {Function} select
     * @access public
     */
    constructor(id, columns, select) {
        var form       = document.getElementById(id.split("#")[1]);
        var div        = document.createElement("div");
        this.tabulator = null;
        div.setAttribute("class", "mt-4");
        div.setAttribute("id", form.getAttribute("id") + "_tabulator");
        form.appendChild(div);
        form.getData = () => {
            ajax(form.getAttribute("action"), (error, response) => {
                this.table(id + "_tabulator", columns, response.data);
            });
        };
        form.getData();
        form.getElementsByTagName("select")[0].addEventListener("change", e => {
            select(e.target.value);
        });
        form.addEventListener("reset", () => {
            this.tabulator.clearFilter();
            form.getData();
        });
        form.addEventListener("submit", e => { // Search field
            ajax(form.getAttribute("action"), 'term=' + e.target.term.value,
            (error, response) => {
                if (!error) {
                    this.table(id + "_tabulator", columns, response.data);
                }
            });
            e.preventDefault();
        });
    }

    /**
     * Tabulator
     *
     * @param {String} id
     * @param {Object} columns
     * @param {Object} data
     * @access public
     */
    table(id, columns, data) {
        this.tabulator = new Tabulator(id, {
            columns: columns,
            data: data,
            autoColumns: false,
            layout: "fitColumns",
            pagination: "local",
            paginationSize: 10,
            locale: false,
            langs: this.language()
        });
        return this.tabulator;
    }

    /**
     * Tabulator filter
     *
     * @param {Array} ...args
     * @access public
     */
    filter(...args) {
        this.tabulator.setFilter(...args);
    }

    /**
     * Translation
     *
     * @access public
     */
    language() {
        return {
            "default": {
                "ajax": {
                    "loading": i18n("Loading..."),
                    "error": i18n("Error")
                },
                "groups": {
                    "item": i18n("Item"),
                    "items": i18n("Items")
                },
                "pagination": {
                    "page_size": i18n("Page size"),
                    "first": i18n("First"),
                    "first_title": i18n("First page"),
                    "last": i18n("Last"),
                    "last_title": i18n("Last page"),
                    "prev": i18n("Previous"),
                    "prev_title": i18n("Previous page"),
                    "next": i18n("Next"),
                    "next_title": i18n("Next page")
                },
                "headerFilters": {
                    "default": i18n("Filter column"),
                    "columns": {
                        "name": i18n("Filter name")
                    }
                }
            }
        }
    }
}
define(function (require, exports, module) {
    exports.datagrid = function () {
        return new Datagrid();
    };
});
