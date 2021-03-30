import { debounce } from './Debounce'

export function createGridUpdater() {
    var grid;
    
    window.addEventListener('resize', debounce(handler, 200), false);
    
    function handler() {
        if (grid) if (grid.updateLayout) {
            setTimeout(() => grid.updateLayout(), 100);
        };
    }

    function setGridRef(gridRef) {
        grid = gridRef;
    }

    return { setGridRef };
}