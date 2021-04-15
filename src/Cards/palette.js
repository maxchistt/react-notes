import React from "react";
import PropTypes from 'prop-types'

export const colorItems = [
  "#F38181",
  "#FCE38A",
  "#EAFFD0",
  "#F9FFEA",
  "#8785A2",
  "#DBE2EF",
  "#D4A5A5",
  "#6EF3D6"
];


function Palette({ setColor, style, className, disabled }) {
  return (
    <span className="dropdown">

      <button
        disabled={disabled}
        className={`btn ${className}`}
        style={style}
        type="button"
        id="dropdownMenuButton"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <i className="bi bi-palette" ></i>
      </button>

      <div className="dropdown-menu tab-content mt-1" aria-labelledby="dropdownMenuButton">
        <form>
          <div className="d-flex flex-row flex-wrap justify-content-center">
            {colorItems.map((color, key) => (
              <button
                style={{
                  borderRadius: "100%",
                  width: "32px", //поменять на rem
                  height: "32px",
                  backgroundColor: color,
                }}
                type="button"
                key={key}
                className={`m-1 btn`}
                onClick={() => setColor(color)}
              >
                {` `}
              </button>
            ))}
          </div>
        </form>
      </div>

    </span>
  );
}

Palette.propTypes = {
  setColor: PropTypes.func,
  style: PropTypes.object,
  className: PropTypes.string,
}

export default Palette;






