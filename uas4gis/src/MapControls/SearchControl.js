
class SearchControl {
    onAdd(map){
      this.map = map;
      this.container = document.createElement('div');
      this.container.className = 'my-custom-control';
      this.container.textContent = 'My custom control';
      return this.container;
    }
    onRemove(){
      this.container.parentNode.removeChild(this.container);
      this.map = undefined;
    }
  }

  export default SearchControl