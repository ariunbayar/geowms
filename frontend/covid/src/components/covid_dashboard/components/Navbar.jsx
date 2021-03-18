import React, { PureComponent } from 'react';

class Navbar extends PureComponent {
    render() {
        return (
            <div>
                <nav class="navbar navbar-expand-lg">
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav">
                            <li class="nav-item active">
                                <a class="nav-link" href="#">CASES <span class="sr-only">(current)</span></a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">Vaccine</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">Graphs</a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        );
    }
}

export default Navbar;
