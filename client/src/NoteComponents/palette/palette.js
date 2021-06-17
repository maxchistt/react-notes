/**
 * @file palette.js
 */
import React from "react";
import PropTypes from 'prop-types'
import "./palette.css"

/**набор цветов */
export const colors = [
  "#f8f9fa",
  "#F38181",
  "#FCE38A",
  "#EAFFD0",
  "#F9FFEA",
  "#8785A2",
  "#DBE2EF",
  "#D4A5A5",
  "#6EF3D6"
];

/**
 * компонент палитры
 * @param {*} param0 
 *  
 */
function Palette({ setColor, style, className, disabled }) {
  return (
    <span className="dropdown">
      {/**Кнопка вызова палитры */}
      <button
        disabled={disabled}
        className={`btn ${className}`}
        style={style}
        type="button"
        id="dropdownMenuButtonPalette"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <i className="bi bi-palette" ></i>
      </button>
      {/**Форма выбора цвета */}
      <div className="dropdown-menu tab-content mt-1" aria-labelledby="dropdownMenuButtonPalette">
        <form>
          <div className="d-flex flex-row flex-wrap justify-content-center">
            {colors.map((color, key) => (
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

// Валидация
Palette.propTypes = {
  setColor: PropTypes.func,
  style: PropTypes.object,
  className: PropTypes.string,
}

export default Palette;






