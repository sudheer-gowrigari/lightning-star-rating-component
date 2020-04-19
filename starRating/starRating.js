import { LightningElement, api, track } from 'lwc';
export default class StarRating extends LightningElement {

  @api size = "medium";

  @track stars;
  @track componentClass = '';
  @track color = "#999";

  isTrueTemplate = true;
  _maximumNumberOfStars = 10;
  _labelText = '';
  _labelPosition = 'left';
  _labelVisible = true;
  _showHalfStars = false;
  _halfStarVisible = false;
  _disabled = false;
  _readOnly = false;
  _rating = 0;
  _staticColor = null;
  _colorDefault = "#999";
  _colorOk = "#ffc058";
  _colorPositive = "#7ed321";
  _colorNegative = "#f03c56";
  _direction = '';
  _hoverEnabled = false;
  _ratingAsInteger = 0;
  _numberOfStars = 5;
  _spaceBetween = "small";


  /**
   * direction
   */
  get direction() {
    return this._direction;
  }

  @api
  set direction(value) {
    this._direction = value || undefined;
  }

  /**
  * labelText
  */
  get labelText() {
    return this._labelText;
  }

  @api
  set labelText(value) {
    this._labelText = value;
  }

  /**
   * labelPosition
   */

  get labelPosition() {
    return this._labelPosition;
  }

  @api
  set labelPosition(value) {
    this._labelPosition = value;
  }

  /**
   * labelVisible
   */

  get labelVisible() {
    return this._labelVisible;
  }

  get labelHidden() {
    return this._labelVisible;
  }

  @api
  set labelHidden(value) {
    this._labelVisible = !value;
  }

  get colorDefault() {
    return this._colorDefault;
  }

  @api
  set colorDefault(value) {
    this._colorDefault = value;
  }

  get colorPositive() {
    return this._colorPositive;
  }

  @api
  set colorPositive(value) {
    this._colorPositive = value;
  }

  get colorNegative() {
    return this._colorNegative;
  }

  @api
  set colorNegative(value) {
    this._colorNegative = value;
  }

  get colorOk() {
    return this._colorOk;
  }

  @api
  set colorOk(value) {
    this._colorOk = value;
  }

  /**
   * hoverEnabled
   */
  get hoverEnabled() {
    return this._hoverEnabled;
  }

  @api
  set hoverEnabled(value) {
    this._hoverEnabled = value !== undefined ? !!value : false;
  }

  get maximumNumberOfStars() {
    return this._maximumNumberOfStars;
  }

  get numberOfStars() {
    return this._numberOfStars;
  }

  @api
  set numberOfStars(value) {
    this._numberOfStars = ((value && value >= this.maximumNumberOfStars) ? this.maximumNumberOfStars : value);
  }

  @api
  set rating(value) {
    this._ratingAsInteger = parseInt(value, 10);
    this._rating = Number(value);
  }
  get rating() {
    return this._rating;
  }

  get spaceBetween(){
    return "space-"+this._spaceBetween;
  }
  @api
  set spaceBetween(value){
    this._spaceBetween = value;
  }

  set halfStarVisible(value) {
    this._halfStarVisible = value;
  }
  get halfStarVisible() {
    return this._halfStarVisible;
  }


  get staticColor() {
    return this._staticColor;
  }

  @api
  set staticColor(value) {
    this._staticColor = value;
  }
  /**
   * disabled
   */
  get disabled() {
    return this._disabled;
  }

  @api
  set disabled(value) {
    this._disabled = !!value;
  }

  /**
   * readOnly
   */
  get readOnly() {
    return this._readOnly;
  }

  @api
  set readOnly(value) {
    this._readOnly = !!value;
  }

  get showHalfStars() {
    return this._showHalfStars;
  }

  @api
  set showHalfStars(value) {
    this._showHalfStars = !!value;
    //update halfStarVisible
    this.setHalfStarVisible();
  }

  connectedCallback() {
    this.step = 1;
    this.hoverRating = 0;
    this.stars = this.getStarsArray();
    this.componentClass = this.getComponentClassNames();
    this.setColor();
  }

  onStarHover(event) {
    if (!this.interactionPossible() || !this.hoverEnabled) {
      return;
    }
    if (event && !event.target) {
      return;
    }
    let targetEl = event.target;
    let rating = this.getStarRatingValue(targetEl);
    this.hoverRating = rating ? parseInt(rating.toString(), 10) : 0;
    //update calculated Color
    this.setColor(true);
  }

  onStopHover() {
    if (!this.interactionPossible() || !this.hoverEnabled) {
      return;
    }
    this.hoverRating = 0;
    //update calculated Color
    this.setColor();
  }

  getComponentClassNames() {
    const classNames = ['rating'];
    classNames.push(this.rating ? 'value-' + this._ratingAsInteger : 'value-0');
    classNames.push(this.halfStarVisible ? 'half' : '');
    classNames.push(this.hoverEnabled ? 'hover' : '');
    classNames.push(this.size);
    classNames.push(this.readOnly ? 'read-only' : '');
    classNames.push(this.disabled ? 'disabled' : '');
    classNames.push(this.labelVisible ? 'label-' + this.labelPosition : 'label-hidden');
    classNames.push(this.direction ? 'direction-' + this.direction : '');
    classNames.push(this.spaceBetween);

    const hoverRating = this.hoverRating
      ? 'hover-' + this.hoverRating
      : 'hover-0';
    classNames.push(this.hoverEnabled ? hoverRating : '');

    return classNames.join(' ');
  }

  getStarsArray(numOfStars) {
    if (!numOfStars) {
      numOfStars = this.numberOfStars;
    }

    let stars = [];
    for (let i = 0; i < numOfStars; i++) {
      let star = {
        id: "star-" + i,
        value: i + 1,
      };
      stars.push(star);
    }
    return stars;
  }

  /**
   * onStarClicked
   *
   * Is fired when a star is clicked. And updated the rating value.
   * This function returns if the disabled or readOnly
   * property is set. If provided it emits the onClick event
   * handler with the actual rating value.
   *
   * @param event
   */
  onStarClicked(event) {
    if (!this.interactionPossible()) {
      return;
    }
    if (event && !event.target) {
      return;
    }
    let targetEl = event.target;
    let ratingValue = this.getStarRatingValue(targetEl);
    this.setRating(ratingValue);
  }

  getStarRatingValue(targetEl) {
    if (!targetEl) {
      return 0;
    }
    let starEl = targetEl.closest("div[data-rating]");
    if (!starEl) {
      return 0;
    }
    let ratingValue = this.getRatingValue(starEl);
    return ratingValue;
  }

  getRatingValue(starEl) {
    return starEl ? parseInt(starEl.getAttribute('data-rating'), 10) : 0;
  }

  setRating(value) {
    let newRating = 0;
    if (value >= 0 && value <= this.numberOfStars) {
      newRating = value;
    }

    //limit max value to max number of stars
    if (value > this.numberOfStars) {
      newRating = this.numberOfStars;
    }
    this._rating = newRating;

    //update _ratingAsInteger. rating parsed to int for the value-[n] modifier
    this._ratingAsInteger = parseInt(this.rating.toString(), 10);
    this.setHalfStarVisible();
    this.setColor();

    //trigger ratingchange event
    this.dispatchEvent(new CustomEvent('ratingchange', {
      detail: {
        rating: this.rating
      }
    }));
  }

  setColor(useHoverValue = false) {
    const ratingValue = useHoverValue ? this.hoverRating : this.rating;
    //check if custom function is given
    if (typeof this.getColor === 'function') {
      this.color = this.getColor(
        ratingValue,
        this.numberOfStars,
        this.staticColor
      );
      this.componentClass = this.getComponentClassNames();
    } else {
      /* this.color = StarRatingUtils.getColor(
        ratingValue,
        this.numOfStars,
        this.staticColor
      ); */
    }
  }

  setHalfStarVisible() {
    //update halfStarVisible
    if (this.showHalfStars) {
      //check if custom function is given
      this.halfStarVisible = this.getHalfStarVisible(this.rating);
    } else {
      this.halfStarVisible = false;
    }
  }

  /*
     * Returns true if there should be a half star visible, and false if not.
     *
     * @param rating
     * @returns {boolean}
     */
  getHalfStarVisible(rating) {
    return Math.abs(rating % 1) > 0;
  }

  interactionPossible() {
    return !this.readOnly && !this.disabled;
  }

  /**ACCESSIBILITY **/

  //Keyboard events
  onKeyDown(event) {
    if (!this.interactionPossible()) {
      return;
    }

    const handlers = {
      //Decrement
      Minus: () => this.decrement(),
      ArrowDown: () => this.decrement(),
      ArrowLeft: () => this.decrement(),

      //Increment
      Plus: () => this.increment(),
      ArrowRight: () => this.increment(),
      ArrowUp: () => this.increment(),

      //Reset
      Backspace: () => this.reset(),
      Delete: () => this.reset(),
      Digit0: () => this.reset()
    };

    const handleDigits = (eventCode) => {
      const dStr = 'Digit';
      const digit = parseInt(
        eventCode.substr(dStr.length, eventCode.length - 1), 10
      );
      this._rating = digit;
      this.setRating(this.rating);
    };

    if (handlers[event.code] || this.isDigitKeyEventCode(event.code)) {
      if (this.isDigitKeyEventCode(event.code)) {
        handleDigits(event.code);
      } else {
        handlers[event.code]();
      }
      event.preventDefault();
      event.stopPropagation();
    }

  }

  /*
     * isDigitKeyEventCode
     * detects digit key event sodes
     * @param eventCode
     * @returns {boolean}
     */
  isDigitKeyEventCode(eventCode) {
    return eventCode.indexOf('Digit') === 0;
  }

  increment() {
    //increment to next higher step
    const absDiff = Math.abs(this.rating % this.step);
    this._rating = this.rating + (absDiff > 0 ? this.step - absDiff : this.step);
    this.setRating(this.rating);
  }

  decrement() {
    //decrement to next lower step
    const absDiff = Math.abs(this.rating % this.step);
    this._rating = this.rating - (absDiff > 0 ? absDiff : this.step);
    this.setRating(this.rating);
  }

  reset() {
    this._rating = 0;
    this.setRating(this.rating);
  }

  getColor(rating, numOfStars, staticColor) {
    rating = rating || 0;

    //if a fix color is set use this one
    if (staticColor) {
      return staticColor;
    }

    //calculate size of smallest fraction
    let fractionSize = numOfStars / 3;

    //apply color by fraction
    let color = this.colorDefault;
    if (rating > 0) {
      color = this.colorNegative;
    }
    if (rating > fractionSize) {
      color = this.colorOk;
    }
    if (rating > fractionSize * 2) {
      color = this.colorPositive;
    }

    return color;
  }

}