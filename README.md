## Personal website ##
I'll write something here, maybe...

_Fonts used:_ Font Awesome, Roboto, Lobster*
_External CSS used: Customized bootstrap grid (without push, pull, offset) + responsive utilities
_External JS used:_ jquery.js, modernizr.js, wow.js
---
* - Converted to SVG because I'm using it for name and surname text so don't need whole font (which is 60kb).

### Dropdown code ###
    <ul class="dropdown__menu right">
        <li class="sub--menu__item"><a href="#">Dropdown link #1</a></li>
        <li class="sub--menu__item">
            <a href="#">Sub link #2</a>
            <ul class="sub--dropdown__menu">
                <li><a href="#">Sub Drop down #1</a></li>
                <li><a href="#">Sub Drop down #2</a></li>
                <li><a href="#">Sub Drop down #3</a></li>
            </ul>
        </li>
        <li class="sub--menu__item"><a href="#">Dropdown link #3</a></li>
        <li class="sub--menu__item">
            <a href="#">Dropdown link #4</a>
        </li>
    </ul>
