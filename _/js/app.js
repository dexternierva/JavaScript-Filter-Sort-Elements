(function () {

    let asc = document.querySelector('.sort-asc .button');
    let desc = document.querySelector('.sort-desc .button');
    let parent = document.querySelector('.cards');
    let originals = parent.children;
    let cards = Array.from(originals);
    let positions = _transform(cards, storeOrigPositions);

    let all = document.querySelector('.all');
    let catA = document.querySelector('.category-a');
    let catB = document.querySelector('.category-b');
    let catC = document.querySelector('.category-c');

    /**
     * Utilities
     * 
     */

    /** Transform -- Map */
    function _transform(arr, fn) {
        var list = [];
        for (var i = 0; i < arr.length; i++) {
            list[i] = fn(arr[i]);
        }
        return list;
    }

    /** Exclude -- Filter */
    function _exclude(arr, fn) {
        var list = [];
        for (var i = 0; i < arr.length; i++) {
            if ( fn(arr[i]) ) {
                list.push(arr[i]);
            } 
        }
        return list;
    }

    /**
     * Sort
     * 
     */

    /** Store Original Position of Each Card */
    function storeOrigPositions(el) {
        var xPos = el.offsetLeft;
        var yPos = el.offsetTop;

        return {
            x: xPos,
            y: yPos
        };
    }

    /** Ascending Sort */
    function ascSort(a, b) { return a.dataset.order - b.dataset.order; }

    /** Descending Sort */
    function descSort(a, b) { return a.dataset.order < b.dataset.order; }

    /** Set Position Absolute To Original Positions */
    function originalPositions(item, position) {
        item.style.position = "absolute";
        item.style.top = position.y + "px";
        item.style.left = position.x + "px";
    }

    /** Get The Position Of The Item That Will Be Replaced, And Animate To That Position */
    function newPosition(item, position) {
        var promise = $(item).animate({
            position: "absolute",
            top: position.y + "px",
            left: position.x + "px"
        }, 500);

        return promise;
    }

    /** Append item to parent div */
    function appendCard (item) {
        parent.appendChild(item); 
        return true;
    }

    function checkVisibility (item) {
        if ( item.style.visibility === 'visible' || !item.style.visibility ) return true;
    }

    /** Sort Ascending Or Descending Depending On SortType Passed In */
    function sortItems(cards, sortType) {
        let items = _exclude(cards, checkVisibility);
        let arr = items.slice();
        let sorted = arr.sort(sortType);
 
        for (let i = 0; i < arr.length; i++) {
            var newIndex = sorted.indexOf(items[i]);
            originalPositions(items[i], positions[i]);
            newPosition(items[i], positions[newIndex]);
        }
        
        /** Replace original elements w/ sorted */
        _transform(sorted, appendCard);
    }

    /**
     * Filter
     *  
     */

    function filterCatA (item) {
        if ( item.classList.contains('cat-a') ) return item;
    }

    function filterCatB (item) {
        if ( item.classList.contains('cat-b') ) return item;
    }

    function filterCatC (item) {
        if ( item.classList.contains('cat-c') ) return item;
    }

    function showAll (cards) {
        _transform(cards, showEl);
        asc.click();
    }

    function hideEl (item) {
        item.style.visibility = "hidden";
        item.style.opacity = 0;
    }

    function showEl (item) {
        item.style.visibility = "visible";
        item.style.opacity = 1;
    }

    function filterCards (cards, fn) {
        let arr = cards.slice();
        let filtered = _exclude(arr, fn);
        let unfiltered = arr.filter( val => !filtered.includes(val) );

        _transform(unfiltered, hideEl);
        _transform(filtered, showEl);

        // Sort Filtered Elements
        sortItems(filtered, ascSort);
    }

    /**
     * Add Event Listeners
     * 
     */
    asc.addEventListener('click', function () { sortItems(cards, ascSort); });
    desc.addEventListener('click', function () { sortItems(cards, descSort); });

    all.addEventListener('click', function () { showAll(cards); });
    catA.addEventListener('click', function () { filterCards(cards, filterCatA); });
    catB.addEventListener('click', function () { filterCards(cards, filterCatB); });
    catC.addEventListener('click', function () { filterCards(cards, filterCatC); });
}());