import React from 'react'

/* Child Component of Board */
function Tile(props) {

    /* Assigns a className for the tile to be styled appropriately */
    function getStyling(value) {

        let styling = "tile";

        switch(value) {

            case "": 
                styling = "tile empty";
                break;

            case 1:
                styling = "tile blue";
                break;

            case 2:
                styling = "tile green";
                break;

            case 3:
                styling = "tile red";
                break;

            case 4:
                styling = "tile darkblue";
                break;

            case 5:
                styling = "tile darkred";
                break;
                
            case 6:
                styling = "tile bluegreen";
                break;

            case 7:
                styling = "tile black";
                break;

            case 8:
                styling = "tile darkgrey";
                break;

            case "M":
                styling = "tile mine";
                break;

            case "F":
                styling = "tile flag";
                break;

            default:
                break;
        }

        return styling;
    }

    /* Gets the value associated with this tile */
    function getValue() {

        const{tile} = props;

        /* If tile hasn't been revealed... */
        if(!tile.revealed) {
            
            /* ... and doesn't have a flag show nothing  */
            if(!tile.flag) {
                return null;
            }

            /* ... and DOES have a flag, display flag */

            return "F";
        }

        /* If the tile is a mine, show that its a mine */
        if(tile.mine) {
            return "M";
        }

        /* If tile is empty, show empty tile */
        if(tile.mineCount === 0) {
            return "";
        }

        /* Else show the tiles value */
        return tile.mineCount;
    }

    let {row, col} = props;

    let value = getValue();
    let style = getStyling(value);

    /* Returns an individual tile with, what to do on left/right click and its vale */
    return (

        <td className={style}
            onClick={() => props.clickHandler(row, col)}
            onContextMenu={() => props.contextHandler(row, col)}
            onMouseDown={() => props.onMouseDown(row, col)}
            onMouseUp={() => props.onMouseUp()}
        >
            {value}
        </td>
    )
}

export default Tile
