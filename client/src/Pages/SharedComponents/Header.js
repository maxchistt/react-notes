import React from 'react';
import logo from '../../Shared/Logo/logo.svg';
import './Header.css';

const brandText = "Notes"

/**компонент хедера с логотипом и навбаром */
function Header(props) {
    return (
        <header className="p-1">
            <nav className="d-flex container px-0 flex-wrap-reverse justify-content-around">
                <div className="text-center d-flex p-1 align-items-center justify-content-center flex-wrap">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="h2 m-0 text-dark pr-3 brand">{brandText}</h1>
                </div>
                <div className="text-center d-flex p-0 align-items-center flex-wrap ml-auto">
                    {props.children}
                </div>
            </nav>
        </header>
    );
}

export default Header;
