class Datagrid extends HTMLElement {

    /**
     * Class constructor
     *
     * @access public
     */
    constructor() {
        super();
        this.table = null;
        this.attr  = {};
    }

    /**
     * Connected callback
     *
     * @access public
     */
    connectedCallback() {
        this.attr.column   = [];
        this.attr.getdata  = this.getAttribute("getdata");
        this.attr.deldata  = this.getAttribute("deldata");
        this.attr.register = this.getAttribute("register");
        this.attr.height   = this.getAttribute("height") || "auto";
        this.attr.id       = (this.getAttribute("id")) ?
                             "#" + this.getAttribute("id") : this;
        let i = 0;
        this.querySelectorAll("column-data").forEach(el => {
            i++;
            this.attr.column[i] = [];
            this.attr.column[i]["title"]    = el.innerHTML;
            this.attr.column[i]["field"]    = el.getAttribute("name");
            this.attr.column[i]["width"]    = el.getAttribute("width");
            this.attr.column[i]["hozAlign"] = el.getAttribute("align");
        });
        this.table = new Tabulator(this.attr.id, this.config());
        $(`#action > button[name='btn_add'],
           #action > button[name='btn_edit'],
           #action > button[name='btn_delete']`)
        .on("click", e => this.action(e.target.name));
    }

    /**
     * Get data via Ajax
     *
     * @param {String} url    ajaxURL property in this.config() method
     * @param {String} config ajaxConfig property in this.config() method
     * @param {String} params ajaxParams property in this.config() method
     * @access public
     */
    getData(url, config, params) {
        return new Promise((resolve, reject) => {
            ajax(url, (error, response) => {
                if (error) {
                    reject(response);
                } else {
                    resolve(response.data);
                }
            });
        });
    }

    /**
     * Top bar
     *
     * @access public
     */
    topbar() {
        return`
        <div class="container-fluid">
          <div class="row bg-master border border-secondary border-bottom-0
          rounded-top">
            <div id="action" class="col-sm-12 col-md-10">
              <button name="btn_add" class="btn btn-outline-primary btn-sm my-2
              my-sm-2 ms-1 border-none text-regular">
                ${icon("plus")} ${i18n("Add")}
              </button>
              <button name="btn_edit" class="btn btn-outline-primary btn-sm my-2
              my-sm-2 ms-1 border-none text-regular" disabled>
                ${icon("edit")} ${i18n("Edit")}
              </button>
              <button name="btn_delete" class="btn btn-outline-primary btn-sm
              my-2 my-sm-2 ms-1 border-none text-regular" disabled>
                ${icon("trash")} ${i18n("Delete")}
              </button>
            </div>
            <div class="col-auto">
              <form action="${this.attr.getdata}" class="d-flex my-1 ajax">
                <input class="form-control rounded-0 rounded-start"
                type="search" placeholder="${i18n("Search")}"
                aria-label="Search" maxlength="250">
                <button type="submit" class="btn bg-primary text-white rounded-0
                rounded-end">
                  ${icon("search")}
                </button>
              </form>
            </div>
          </div>
        </div>`;
    }

    /**
     * Enable or disable the top bar button
     *
     * @param {Number} selected_rows
     * @access public
     */
    topbarButton(selected_rows) {
        let disabled = true;
        if (selected_rows === 1) {
            disabled = false;
        }
        $("#action > button[name='btn_edit']").attr("disabled", disabled);
        if (selected_rows >= 1) {
            disabled = false;
        }
        $("#action > button[name='btn_delete']").attr("disabled", disabled);
    }

    /**
     * Context menu
     *
     * @param {Object} data
     * @access public
     */
    contextMenu(data) {
        data.select();
        return [{
                // -------------------------------------------------------------
                // Select all
                // -------------------------------------------------------------
                    label: icon("check-square") + " " + i18n("Select all"),
                    action: (e, row) => this.table.selectRow()
                },{
                // -------------------------------------------------------------
                // Remove selection
                // -------------------------------------------------------------
                    label: icon("square") + " " + i18n("Remove selection"),
                    action: (e, row) => this.table.deselectRow()
                },{
                    separator: true // =========================================
                },{
                // -------------------------------------------------------------
                // Edit
                // -------------------------------------------------------------
                    label: icon("edit") + " " + i18n("Edit"),
                    action: (e, row) => this.action("btn_edit"),
                    disabled: (this.table.getSelectedData().length === 1)
                              ? false : true
                },{
                // -------------------------------------------------------------
                // Delete
                // -------------------------------------------------------------
                    label: icon("trash") + " " + i18n("Delete"),
                    action: (e, row) => this.action("btn_delete")
                }];
    }

    /**
     * Database operations
     *
     * @access public
     */
    action(btn_name) {
        if (btn_name === "btn_add") {
            ajax(this.attr.register);
        } else if (btn_name === "btn_delete" || btn_name === "btn_edit") {
            var data = this.table.getSelectedData();
            var size = data.length;
            if (btn_name === "btn_edit" && size === 1) {
                /*ajax(attr["add"], function () {
                    $("form").each(function (n) {
                        if (n === 0) { // First form found.
                            $(this).prepend('<input type="hidden" name="id">');
                            for( var key in data[0] ) {
                                $(this).find('input[name="' + key + '"]').val(data[0][key]);
                            }
                        }
                    });
                });*/
            } else if (btn_name === "btn_delete" && size > 0) {
                let text = [];
                text["warning"] = "Do you want to delete the selected records?";
                text["success"] = "Successfully deleted!";
                text["danger"]  = "Error! Could not delete!";
                let message = type =>
                              `${icon(type, "2x")}
                               <h5 class="mt-3 text-secondary">
                               ${i18n(text[type])}
                               </h5>`;
                dialog.confirm(message("warning"), event => {
                    if (event) {
                        var id = "";
                        for (let i=0; i < size; i++) {
                            if (data[i].id) {
                                id += "," + data[i].id;
                            }
                        }
                        ajax(this.attr.deldata + "/?id=" + id.substr(1),
                        (error, res) => {
                            this.table.deselectRow();
                            if (!error) {
                                this.table.deleteRow(id.split(","));
                                dialog.alert(message("success"));
                            } else {
                                dialog.alert(message("danger"));
                            }
                        });
                    }
                });
            }
        }
    }

    /**
     * Datagrid settings
     *
     * @access public
     */
    config() {
        var attr     = {};
        attr.getdata = this.attr.getdata;
        attr.height  = this.attr.height;
        attr.column  = this.attr.column;
        return {
            tableBuilding: () => $(this.topbar()).insertBefore(this),
            ajaxURL: attr.getdata,
            ajaxRequestFunc: this.getData,
            ajaxConfig: {
            method: "GET",
                headers: {
                    "Content-type": "application/json; charset=utf-8"
                }
            },
            locale: false,
            langs: {
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
            },
            height: attr.height,
            layout: "fitColumns",
            responsiveLayout: "hide",
            tooltips: true,
            history: true,
            pagination: "local",
            paginationSize: 10,
            movableColumns: true,
            resizableRows: false,
            selectable: true,
            columns: attr.column,
            rowContextMenu: data => this.contextMenu(data),
            rowSelectionChanged: (data, rows) => {
                this.topbarButton(data.length);
            }
        };
    }
}
customElements.define("jnex-datagrid", Datagrid);
define(function (require, exports, module) {
    exports.datagrid = function () {
        return new Datagrid();
    };
});
