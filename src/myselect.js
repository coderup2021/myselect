void (function(window){
    function MySelect(originSelect){
        this.originSelect = originSelect
        this.originSelect.style.display = "none"
        this.options = originSelect.querySelectorAll('option')
        if(this.hasGenerated(this.originSelect)){
            this.destroyOld(this.originSelect)
        }
        this.selectBox = this.createSelectBox()
        this.setWidth(originSelect)

        this.__mySelectDocumentEvent = this.mySelectDocumentEvent.bind(this)

        this.displayValueSpan = this.createDisplayValueSpan()
        
        this.displayValueBox = this.createDisplayValueBox()
        this.displayValueBox.appendChild(this.displayValueSpan)
        this.triangleIcon = this.createIcon()
        this.displayValueBox.appendChild(this.triangleIcon)

        //初始化下拉框
        this.dropdownBox = this.createDropdownBox()
        this.initDropdownList(this.dropdownBox, this.options)
        this.initDisplayValueSpan()
        //渲染下拉框
        this.displayValueBox.appendChild(this.dropdownBox)
        this.selectBox.appendChild(this.displayValueBox)

        //
        originSelect.parentNode.insertBefore(this.selectBox, originSelect) 
    }

    MySelect.prototype.createIcon = function(){
        var icon = document.createElement("span")
        icon.setAttribute("class", "triangle-icon iconfont icon-arrow-up triangle-icon-reverse")
        return icon
    }

    MySelect.prototype.iconToggleUpDown = function(){
        var klass = this.triangleIcon.getAttribute('class')
        if(klass.indexOf('triangle-icon-reverse') > -1){
            this.triangleIcon.setAttribute('class', klass.replace(" triangle-icon-reverse", ""))
        }else{
            this.triangleIcon.setAttribute('class', klass + " triangle-icon-reverse")
        }
    }

    MySelect.prototype.setWidth = function(originSelect){
        var width = originSelect.getAttribute('width')
        if(width){
            this.selectBox.style.width = width
        }
    }
    MySelect.prototype.destroyOld = function(originSelect){
        if(originSelect.previousElementSibling){
            originSelect.previousElementSibling.remove()
        }
    }
    MySelect.prototype.hasGenerated = function(originSelect){
        if(originSelect.previousElementSibling
        && originSelect.previousElementSibling.getAttribute("class")
        && originSelect.previousElementSibling.getAttribute("class").indexOf('my-select-box')>-1 ){
            return true
        }
        return false
    }
    MySelect.prototype.creatItem = function(option){
        var p = document.createElement('p')
        p.setAttribute('class', 'my-select-box-list-item')
        p.setAttribute('value', option.value)
        p.textContent = option.lastChild.textContent
        return p
    }

    MySelect.prototype.initDropdownList = function(dropdownBox, originOptions){
        for(var i=0; i<originOptions.length; i++){
            var item = this.creatItem(originOptions[i])
            dropdownBox.appendChild(item)
        }
    }

    MySelect.prototype.createSelectBox = function(){
        var selectBox = document.createElement('div')
        selectBox.setAttribute('class', 'my-select-box')
        return selectBox
    }

    MySelect.prototype.initDisplayValueSpan = function(){
        this.displayValueSpan.textContent = this.findTextContentByValue(this.originSelect.value, this.options)
    }
    MySelect.prototype.findTextContentByValue = function(value, options){
        var textContent = ""
        for(var i=0; i<options.length; i++){
            if(options[i].value === value){
                textContent = options[i].lastChild.nodeValue      
                break
            }
        }
        if(textContent === ""){
            textContent = options[0].textContent
        }
        return textContent
    }

    MySelect.prototype.removeTags = function(textContent){
        return textContent.replace(/<*>*<\/>/g, "")
    }

    MySelect.prototype.createDropdownBox = function(){
        var dropdownBox = document.createElement('div')
        dropdownBox.setAttribute('class', 'my-select-dropdown-box')
        dropdownBox.style.display = 'none'
        var _this = this
        dropdownBox.addEventListener("click", function(event){
            if(event.target.tagName && event.target.tagName.toUpperCase() === 'P'){
                _this.displayValueSpan.textContent = event.target.lastChild.nodeValue
                _this.originSelect.value = event.target.getAttribute('value')

        if("createEvent" in document) {
                    var evt = document.createEvent("HTMLEvents");
                    evt.initEvent("change", false, true);
                    _this.originSelect.dispatchEvent(evt);
                }else{
                    _this.originSelect.fireEvent("onchange");
                } 
            }
        })
        return dropdownBox
    }

    MySelect.prototype.mySelectDocumentEvent = function(event){
        var _this = this
        if(!_this.selectBox.contains(event.target)){
            this.dropdownBox.style.display = "none"
            this.iconToggleUpDown()
            _this.removeDocumentEvent()
        }
    }

    MySelect.prototype.addDocumentEvent = function(){
        var _this = this
        document.addEventListener('click', _this.__mySelectDocumentEvent)
    }

    MySelect.prototype.removeDocumentEvent = function(){
        var _this = this
        document.removeEventListener('click', _this.__mySelectDocumentEvent)
    }

    MySelect.prototype.toggleDropdownDisplay = function(event){
        var _this = this
        if(this.dropdownBox.style.display === "none"){
            this.dropdownBox.style.display = "block"
            setTimeout(function(){
                _this.addDocumentEvent()
            },0)
        }else{
            this.dropdownBox.style.display = "none"
            this.removeDocumentEvent()
        }
        this.iconToggleUpDown()
    }

    MySelect.prototype.createDisplayValueSpan = function(){
        var displayValueSpan = document.createElement('span')
        displayValueSpan.setAttribute('class', 'my-select-display-value')
        return displayValueSpan
    }

    MySelect.prototype.createDisplayValueBox = function(){
        var _this = this
        var displayValueBox = document.createElement('div')
        displayValueBox.setAttribute('class', 'my-select-display-value-box')
        displayValueBox.addEventListener('click', function(event){
            _this.toggleDropdownDisplay(event)
        })
        return displayValueBox
    }
    window.MySelect = MySelect
})(window)