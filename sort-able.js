class SortTable extends HTMLTableElement {

    static observedAttributes = [];

    //---Custom Element Lifecycle Hooks----------------------------------------

    constructor() {
        super();
    }

    connectedCallback() {
        this.setUp();
    }

    disconnectedCallback() {
        //console.log("Custom element removed from page.");
    }

    adoptedCallback() {
        //console.log("Custom element moved to new page.");
    }

    attributeChangedCallback(name, oldValue, newValue) {
        //console.log(`Attribute ${name} has changed.`);
    }

    //---DOM utils-------------------------------------------------------------

    hasHeaderRow() {
        return this.getElementsByTagName('thead').length !== 0
    }

    getHeaderRow() {
        return super.tHead?.rows[0];
    }

    getTableBody() {
        return this.tBodies[0];
    }

    getHeaderCells() {
        let tr = this.getHeaderRow();
        return tr ? [...tr.cells] : [];
    }

    activateByKeyboard(event, callback) {
        const KEY_ENTER = 13;
        const KEY_SPACE = 32;

        const KEY_ARROW_UP = 38;
        const KEY_ARROW_DOWN = 40

        const key = event.which;

        //console.log(key)

        if (key === KEY_ENTER || key === KEY_SPACE) {
            callback(event);
        } else if (key === KEY_ARROW_UP) {
            callback(event, "asc");
        } else if (key === KEY_ARROW_DOWN) {
            callback(event, "desc");
        }


    }

    //---Setup-----------------------------------------------------------------

    setUp() {
        //console.log("set up", this)
        this.makeHeaderClickable();
    }

    makeHeaderClickable() {
        this.ensureHeaderRow();

        this.getHeaderCells().forEach((th, index) => {
            
            console.log("adding event listeners to", th, index)
            
            th.tabIndex = 0;


            th.addEventListener("click", (e) => this.sortBy(e, index), false);
            th.addEventListener("keydown", (e) => this.activateByKeyboard(e, (e, direction = "asc") => this.sortBy(e, index, direction), false))

            // TODO add suitable aria attributes
        });
    }

    ensureHeaderRow() {
        if (!this.hasHeaderRow()) {
            let headerElement = document.createElement('thead');
            let firstRow = super.rows[0];

            // console.log({rows: this.row, firstRow, self: this})

            headerElement.appendChild(firstRow);
            this.insertBefore(headerElement, this.firstChild);
        }
    }

    //---Sorting---------------------------------------------------------------

    sortBy(event, column, direction = "asc") {
        // what if it is already sorted in that direction? likely a reverse?

        let tbody = this.getTableBody();
        let rows = [...tbody.rows];

        let comparator = 
            (a, b) => a.value.localeCompare(b.value);

        let orderedBy = 
            direction === "desc" 
                ? (a, b) => comparator(b, a) 
                : comparator;

        let sortedRows = rows.map((row) => {
            return {
                element: row,
                value: this.getValue(row, column)
            }
        }).sort(orderedBy);


        sortedRows.forEach(bag => {
            tbody.appendChild(bag.element);
        })

    }

    getValue(row, column) {
        // console.log({row, column})
        return row.cells[column].innerText.trim();
    }

}

// console.log("Defining sort-able custom element")

customElements.define("sort-able", SortTable, { extends: "table" });
