'use strict';


class Input {
    constructor(parent, id, table) {
        this.parent = parent;
        this.id = id;
        this.element = document.createElement("input");
        this.table = table;


        return this;
    }
    config() {
        this.element.setAttribute("type", "text");
        this.element.setAttribute("list", "suggestions");

        this.element.addEventListener("focus", () => this.table.manageData(this.value, this.parent, "remove"));
        this.element.addEventListener("focusout", () => this.table.manageData(this.value, this.parent, "update"));

        this.element.style.setProperty("text-align", "center");
        this.element.style.setProperty("font-weight", "bold");
        this.element.style.setProperty("border-radius", "20px");



        return this;
    }
    init() {
        this.parent.element.appendChild(this.element);


        return this;
    }
    changeValue(newValue){
        this.element.value = newValue;


        return this;
    }
    get value() {
        return this.element.value;
    }
}


class Label {
    constructor(element, id, table, group) {
        this.element = element;
        this.id = id;
        this.table = table;
        this.group = group;
        this.input = new Input(this, this.id, this.table).config().init();


        return this;
    }
    get name() {
        console.log(this.group);
        return this.element.querySelector("span[itemprop='name']")?.textContent;
    }
    get image() {
        return this.element.querySelector("img")?.src;
    }
    get sex(){
        let result = undefined;
        let getSex = this.element.querySelector("div[class='general']")?.innerText;

        if(getSex.includes("female")){
            result = "female";
        } else if(getSex.includes("male")){
            result = "male";
        }

        return result;
    }
}

class Overlay{
    constructor(onShow = null){
        this.onShow = onShow;
        

        this.shadowHost = document.createElement("div");
        this.shadowHost.id = "char-shadow-host";
        document.body.appendChild(this.shadowHost);
        

        this.shadowRoot = this.shadowHost.attachShadow({mode: "open"});
        

        this.overlay = document.createElement("div");
        this.overlay.className = "char-overlay";
        this.overlay.style.display = "none";
        this.shadowRoot.appendChild(this.overlay);


        this._iframe = document.createElement("iframe");
        this._iframe.setAttribute("title", "CharacterTable");
        this.overlay.appendChild(this._iframe);


        this.buttonWrapper = document.createElement("div");
        this.buttonWrapper.className = "tooltip-left";
        this.buttonWrapper.setAttribute("data-tooltip", "Open Character table");

        this.toggleButton = document.createElement("button");
        this.toggleButton.className = "btn btn-glass";
        //this.toggleButton.setAttribute("title", "Open Character table");
        this.buttonWrapper.appendChild(this.toggleButton);
        this.shadowRoot.appendChild(this.buttonWrapper);

        this.toggleButton.addEventListener("click", () => this._toggleOverlay());

        // document.addEventListener("keydown", (e) => {
        //     if(e.key == "Escape") this._hiderOverlay();
        // });
        this._iframe.contentWindow.document.addEventListener("keydown", (e) => {
            console.log(e);
            if(e.key == "Escape") this._toggleOverlay();
        });


        return this;
    }
    config(){
        this._iframe.style.width = "90%";
        this._iframe.style.height = "90%";
        this._iframe.style.border = "none";
        this._iframe.style.borderRadius = "8px";
        
        
        return this;
    }
    _cssInjection(){
        const css = document.createElement("style");
        css.setAttribute("type", "text/css");
        css.textContent = `
.char-overlay {
	display: none;
	position: fixed;
	inset: 0;
	align-items: center;
	justify-content: center;
	background-color: rgba(0, 0, 0, 0.65);
	z-index: 9998;
}

.btn {
	width: 50px;
	height: 50px;
	border-radius: 100%;
	color: white;
	border-style: solid;
	transition: all 0.3s ease;
	font-family: system-ui, sans-serif;
	z-index: 9999;
}

.btn-glass {
	background: rgba(255, 255, 255, 0);
	backdrop-filter: blur(10px);
	border: 2px solid black;
	color: white;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    z-index: 10000;
}

.btn-glass:hover {
	border-color: white;
	transform: translateY(-5px);
}


.btn-glass.active::before {
    content: '';
    border: 2px solid white;
    position: absolute;
    inset: -3px;
    border-radius: 100%;
    mask: radial-gradient(circle, transparent 50%, black 75%);
    animation: rotate 3s linear infinite;
}

.tooltip-left {
	position: fixed;
	bottom: 30px;
	right: 20px;
	width: 50px;
	height: 50px;
	border-radius: 100%;
    z-index:9998
}

.tooltip-left::before {
    content: attr(data-tooltip);
    visibility: hidden;
    background-color: #4CAF50;
    color: white;
    text-align: center;
    padding: 8px 12px;
    border-radius: 6px;
    position: absolute;
    top: 41%;
    right: 110%;
    transform: translateY(-50%);
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.3s;
}

.tooltip-left:hover::before {
    visibility: visible;
    opacity: 1;
}
@keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
            `;
        this.shadowRoot.appendChild(css);
        
        this._iframe.style.background = "transparent";
        this._iframe.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.2)";


        return this;
    }

    getIframe(){
        return this._iframe;
    }

    _showOverlay(){
        this.overlay.style.display = "flex";
        
        this._iframe.contentWindow.document.body.style.margin = '0';
        this._iframe.contentWindow.document.body.style.height = '100%';
        this._iframe.contentWindow.document.body.style.background = 'transparent';
        
        this._iframe.focus();

        //this.toggleButton.setAttribute("title", "Close character table");
        this.buttonWrapper.setAttribute("data-tooltip", "Close character table");
        this?.onShow();
        document.documentElement.style.overflow = 'hidden';


        return this;
    }

    _hideOverlay(){
        this.overlay.style.display = "none";
        //this.toggleButton.setAttribute("title", "Open character table");
        this.buttonWrapper.setAttribute("data-tooltip", "Open character table");
        document.documentElement.style.overflow = "";


        return this;
    }

    _toggleOverlay(){
        this.toggleButton.classList.toggle("active");
        if(this.overlay.style.display == "none" || this.overlay.style.display == ""){
            this._showOverlay();
        } else {
            this._hideOverlay();
        }
    }
    
}
class Table {
    constructor() {
        this.memory = new Object();

        this.overlay = new Overlay(() => this.refreshTable());
        this.overlay.config()._cssInjection();

        this._iframe = this.overlay.getIframe();


        console.log(this._iframe);
        this.document = this._iframe.contentWindow.document;


        this.table = this.document.createElement("div");
        this.table.style.width = "100%";
        this.table.style.height = "100%";
        this.document.body.appendChild(this.table);


        this.dataList = document.createElement("datalist");
        document.body.appendChild(this.dataList);
        this._cssInjection();

        return this;
    }
    _cssInjection(){
        const css = document.createElement("style");
        css.setAttribute("type", "text/css");
        css.textContent = `
            input::-webkit-calendar-picker-indicator {
                display: none !important;
            }
        `;
        document.head.appendChild(css);


        return this;
    }
    config() {
        this.dataList.setAttribute("id", "suggestions");


        return this;
    }

    init() {
        (this.element);


        return this;
    }
    manageData(key, value, flag) {
        if(key == "") return this;
        if (!this.memory.hasOwnProperty(key)) {
            this.memory[key] = new Set();
        }

        if (flag == "update") {
            if (!this.memory[key].has(value)) {
                this.memory[key].add(value);
            }
        } else if (flag == "remove") {
            if (this.memory[key].has(value)) {
                this.memory[key].delete(value);
            }
        }
        if (this.memory[key].size == 0) {
            delete this.memory[key];
        }
        console.log(this.memory);
        this.refreshTable();
        this.refreshDataList();


        return this;
    }

    refreshTable() {
        this.table.textContent = "";

        let gridOptions = {
            onCellValueChanged: (event) => {
                let oldValue = event.oldValue;
                let newValue = event.newValue;
                let keyValue = event.data.hiddenField;

                this.manageData(oldValue, keyValue, "remove");
                keyValue.input.changeValue(newValue);
                if(newValue !== null){
                    this.manageData(newValue, keyValue, "update");
                }

                


            },
            groupDefaultExpanded: 1,
            defaultColDef: {
                cellStyle: {
                    'text-align': 'center',
                    'display': 'flex',
                    'align-items': 'center',
                    'justify-content': 'center'
                },
                unSortIcon: true,
            },
            columnDefs: [{
                field: "Image",
                autoHeight: true,
                comparator: (valueA, valueB) => {
                    return (valueA === undefined) ? -1 : 1;
                },
                cellRenderer: (params) => {
                    if(params.value === undefined) return undefined;
                    const img = document.createElement('img');
                    img.src = params.value;
                    img.style.width = '50%';
                    img.style.height = '50%';
                    img.style.cursor = 'pointer';
                    
                    const iframeDoc = this.document;
                    const previewWidth = 200;
                    const previewHeight = 300;
                    const offset = 15;
                    
                    img.addEventListener("mouseenter", function(e){
                        let imagePreview = iframeDoc.createElement("div");
                        imagePreview.setAttribute("id", "imagepreview");    
                        imagePreview.setAttribute("class", "g_bubble");
                        imagePreview.style.position = "fixed";
                        imagePreview.style.zIndex = "10000";
                        imagePreview.style.pointerEvents = "none";

                        let imgContainer = iframeDoc.createElement("img");
                        imgContainer.setAttribute("class", "g_image");
                        imgContainer.setAttribute("alt", "Image Preview");
                        imgContainer.style.maxWidth = previewWidth + "px";
                        imgContainer.style.maxHeight = previewHeight + "px";
                        imgContainer.style.borderRadius = "4px";
                        imgContainer.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
                        imgContainer.src = e.target.src.replace(".jpg-thumb", "");
                        
                        imagePreview.appendChild(imgContainer);
                        iframeDoc.body.appendChild(imagePreview);


                        let posX = e.pageX + offset;
                        let posY = e.pageY + offset;
                        const viewportWidth = window.innerWidth || iframeDoc.documentElement.clientWidth;
                        const viewportHeight = window.innerHeight || iframeDoc.documentElement.clientHeight;

                        if (posX + previewWidth > viewportWidth) {
                            posX = e.pageX - previewWidth - offset;
                        }
                        if (posY + previewHeight > viewportHeight) {
                            posY = e.pageY - previewHeight - offset;
                        }
                        if (posX < 0) {
                            posX = offset;
                        }
                        if (posY < 0) {
                            posY = offset;
                        }
                        
                        imagePreview.style.top = posY + "px";
                        imagePreview.style.left = posX + "px";
                    });
                    
                    img.addEventListener("mouseout", function(e){
                        iframeDoc.querySelectorAll("#imagepreview").forEach((el) => el?.remove());
                    });

                    return img;
                },

            }, {
                field: "Name of Character",
            }, {
                field: "Sex",
            }, {
                field: "Group",
            }, {
                field: "Casting",
                editable: true,
            }],
            rowData: [],
            groupDisplayType: 'singleColumn',
        };



        for (let nameCasting of Object.keys(this.memory)) {
            Array.from(this.memory[nameCasting]).forEach((element) => {
                let obj = {
                    "Image": element.image,
                    "Sex": element.sex,
                    "Name of Character": element.name,
                    "Group": element.group,
                    "Casting": nameCasting,
                    hiddenField: element,
                };




                gridOptions["rowData"].push(obj);
            });

        }

        console.log(gridOptions)
        
        agGrid.createGrid(this.table, gridOptions);


        return this;
    }



    refreshDataList(){
        this.dataList.textContent = "";

        for (let nameCasting of Object.keys(this.memory)) {
            const _option = document.createElement("option");
            _option.setAttribute("value", nameCasting);

            this.dataList.appendChild(_option);
        }


        return this;
    }

}

function main(){
    var listOfObjects = [];
    let table = new Table()
    table.config().init();

    const containerCharacter = Array.from(document.querySelectorAll("div[class='container ']")).filter((e) => e.querySelector("div[class*='g_section ']"))[0];

    const groupCharacter = containerCharacter?.querySelectorAll("div[class^='g_section']");

    groupCharacter?.forEach((group) => {
        console.log(group);
        const nameOfGroup = group.querySelector("h6")?.textContent;
        const characters = group.querySelectorAll("div[id^='charid_'], div[id^='crtid_']");
        for (let i = 0; i < characters.length; i++) {
            listOfObjects.push(new Label(characters[i], i, table, nameOfGroup));
        }

    });

}
chrome.storage.local.get("stateOfExtension").then(({stateOfExtension}) => {
    if(stateOfExtension == "ON"){
        main();
    }
});