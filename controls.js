class Controls
{
    constructor(type)
    {
        this.forward = false;
        this.left = false;
        this.right = false;
        this.reverse = false;

        switch(type)
        {
            case "KEYS":
                this.#addKeyboardListeners();
                break;
            case "DUMMY" :
                this.forward = true;
                break;
        }
    }

    #addKeyboardListeners()
    {
        document.onkeydown=(event)=>
        {
            switch(event.key)
            {
                case "w" :
                    this.forward = true;
                    break;
                case "W" :
                    this.forward = true;
                    break;    
                case "a" :
                    this.left = true;
                    break;
                case "A" :
                    this.left = true;
                    break; 
                case "s" :
                    this.reverse = true;
                    break;
                case "S" :
                    this.reverse = true;
                    break; 
                case "d" :
                    this.right = true;
                    break;
                case "D" :
                    this.right = true;
                    break; 
            }
        }
        document.onkeyup=(event)=>
        {
            switch(event.key)
            {
                case "w" :
                    this.forward = false;
                    break;
                case "W" :
                    this.forward = false;
                    break;    
                case "a" :
                    this.left = false;
                    break;
                case "A" :
                    this.left = false;
                    break; 
                case "s" :
                    this.reverse = false;
                    break;
                case "S" :
                    this.reverse = false;
                    break; 
                case "d" :
                    this.right = false;
                    break;
                case "D" :
                    this.right = false;
                    break; 
            }
        }
    }

}