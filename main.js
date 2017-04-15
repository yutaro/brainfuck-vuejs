(()=>{
"use strict";

let bf = new Vue({
    el : "#BF",
    data:{
        code    : "",
        steps   : [],
        pos     : 0,
        cells   : [],
        braceMap: {},
        ptr     : 0,
        outStr  : "",
        active  : false,
        err     : false,
    },
    computed :{
        ended     : function(){
            return this.steps.length <= this.pos;
        },
        stepActive: function(){
            return !(this.ended || this.err);
        }
    },
    methods:{
        load : function(){
            this.steps = this.code.replace(/[^\+\-<>\.,\[\]]/g, '').split('');
            this.pos = 0;
            this.cells = Array(20).fill(0);
            this.outStr = "";
            this.braceMap = {};
            this.err = false;
            try{
                let s = this.steps;
                let stack = [];
                let c = 0;
                for(let i = 0; i < s.length; i++){
                    if(s[i] === '['){
                        stack.push(i);
                        c++;
                    }else if(s[i] === ']'){
                        let start = stack.pop();
                        this.braceMap[start] = i;
                        this.braceMap[i]     = start;
                        c--;
                    }
                }
                if (stack.length !== 0){
                    throw 'too many [ !';
                }
                if (c < 0){
                    throw 'too many ] !';
                }
            }catch(e){
                alert(e);
                this.err = true;
                return;
            }
            this.active = true;
        },
        step : function(){
            try{
                switch(this.steps[this.pos]){
                    case "+": this.increment();break;
                    case "-": this.decrement();break;
                    case ">": this.forward()  ;break;
                    case "<": this.back()     ;break;
                    case ",": this.input()    ;break;
                    case ".": this.output()   ;break;
                    case '[': this.startLoop();break;
                    case ']': this.endLoop()  ;break;
                }
                this.pos++;
            }catch(e){
                alert(e);
                this.err = true;
                return;
            }
        },
        run  : function(){
            while(this.stepActive){
                this.step();
            }
        },
        reset: function(){
            this.active = false;
            this.code = "";
        },
        increment : function(){
            this.cells[this.ptr]++;
            if(this.cells[this.ptr] > 255){
                this.cells[this.ptr] = 0;
            }
        },
        decrement : function(){
            this.cells[this.ptr]--;
            if(this.cells[this.ptr] < 0){
                this.cells[this.ptr] = 255;
            }
        },
        forward   : function(){
            this.ptr++;
            if(this.ptr === this.cells.length){
                this.cells.push(0);
            }
        },
        back      : function(){
            this.ptr--;
            if(this.ptr < 0){
                throw "bad cell address!";
            }
        },
        input    : function(){
            let s = prompt('Enter one character');
            if (s ==='' || s === null || s.charCodeAt(0) > 255 || s.length > 1){
                this.cells[this.ptr] = 0;
            }else{
                this.cells[this.ptr] = s.charCodeAt(0);
            }
        },
        output   : function(){
            this.outStr += String.fromCharCode(this.cells[this.ptr]);
        },
        startLoop: function(){
            if(this.cells[this.ptr] === 0){
                this.pos = this.braceMap[this.pos];
            }
        },
        endLoop  : function(){
            if(this.cells[this.ptr] !== 0){
                this.pos = this.braceMap[this.pos];
            }
        },
    },
});
document.getElementById('code').focus();
})();