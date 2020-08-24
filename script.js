//Elektrisches Feld

//MIT-Lizenz: Copyright (c) 2019 Matthias Perenthaler
//
//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
//The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

let maxActiveWide = 1260;

let p5sketch = function(p) {

  // Vektor-Feld berechnen und anzeigen
  let resultierendesVektorFeld = [];
  let vektorFeldBerechnenBool = false;
  let aequipotBerechnenBool = false;
  
  let ladungsArray = [];
  let ladungsDurchmesser = 24;
  let ladungsmenge = 1; 

  let xRand = 20;
  let yRand = 20;
  
  let sensorDurchmesser = 30;
  let sensorArray = [];

  let sensorPfadArray =[];
  let pfadeArray = [];
  let andereRichtungPfadeArray = [];
  
  let aequipotentialfeldPfadArray =[];
  let aequipfadeArray = [];  
  
  let ladungBewegen = false;
  let sensorBewegen = false;
  
  function efeldVektorPrototyp(koord, laenge, richtung) {
    this.koord = koord;
    this.laenge = laenge;
    this.richtung = richtung;
  }

  function ladungPrototyp(koordVec, durchmesser, ladung) {
    this.koordVec = koordVec;
    this.durchmesser = durchmesser;
    this.ladung = ladung;
    this.vorzeichenDicke = 2;
    this.vorzeichenDelta = 4.5;
    this.sensorDicke = 2;
    this.zeichnen = function() {
      if (this.ladung < 0) {
        p.ellipse(this.koordVec.x, this.koordVec.y, this.durchmesser, this.durchmesser);
        p.push();
        p.stroke(255);
        p.strokeWeight(this.vorzeichenDicke);
        p.line(this.koordVec.x-this.durchmesser/this.vorzeichenDelta, this.koordVec.y, this.koordVec.x+this.durchmesser/this.vorzeichenDelta, this.koordVec.y);
        p.pop();
      }
      if (this.ladung > 0) {
        p.ellipse(this.koordVec.x, this.koordVec.y, this.durchmesser, this.durchmesser);
        p.push();
        p.stroke(255);
        p.strokeWeight(this.vorzeichenDicke);
        p.line(this.koordVec.x-this.durchmesser/this.vorzeichenDelta, this.koordVec.y, this.koordVec.x+this.durchmesser/this.vorzeichenDelta, this.koordVec.y);
        p.line(this.koordVec.x, this.koordVec.y-this.durchmesser/this.vorzeichenDelta, this.koordVec.x, this.koordVec.y+this.durchmesser/this.vorzeichenDelta);
        p.pop();
      }
      if (this.ladung === 0) {
      }      
    };
    this.verschieben = function(neueKoord) {
      this.koordVec = neueKoord;
    };   
  }

  function vordefinierteKonfigurationenLaden(item) {
    let aktuelleLadungsKoord;
    let ladungLokal;
    let anzahlSensoren;
    let abstandSensorenzurLadung;
    switch (item.value) {
        case '':
          break;       
        case 'Eine Ladung':
          canvasZuruecksetzen();
          aktuelleLadungsKoord = p.createVector(p.width/2, p.height/2);    
          ladungLokal = new ladungPrototyp(aktuelleLadungsKoord, ladungsDurchmesser, 1);
          ladungsArray.push(ladungLokal);
          anzahlSensoren = 10;
          abstandSensorenzurLadung = 30;
          for (let i = 0; i < anzahlSensoren; i++) {
            if (ladungsArray.length > 0) {
              abstandSensorenzurLadung = abstandSensorenzurLadung + i*6;
              let rotiereVektor = p.createVector(abstandSensorenzurLadung*p.cos(i*(2*p.PI)/anzahlSensoren),abstandSensorenzurLadung*p.sin(i*(2*p.PI)/anzahlSensoren));
              let zielOrtsVektor = p.createVector(p.width/2, p.height/2);
              let aktuellesensorKoord = p5.Vector.add(zielOrtsVektor, rotiereVektor);
              let sensorLokal = new ladungPrototyp(aktuellesensorKoord, sensorDurchmesser, 0);
              sensorArray.push(sensorLokal);
            }            
          }
          break;
        case 'Zwei gleiche Ladungen':
          canvasZuruecksetzen();
          aktuelleLadungsKoord = p.createVector(p.width/2-150, p.height/2);    
          ladungLokal = new ladungPrototyp(aktuelleLadungsKoord, ladungsDurchmesser, 1);
          ladungsArray.push(ladungLokal);
          aktuelleLadungsKoord = p.createVector(p.width/2+150, p.height/2);    
          ladungLokal = new ladungPrototyp(aktuelleLadungsKoord, ladungsDurchmesser, 1);
          ladungsArray.push(ladungLokal);            
          anzahlSensoren = 6;
          abstandSensorenzurLadung = 30;
          for (let i = 0; i < anzahlSensoren; i++) {
            if (ladungsArray.length > 0) {
              abstandSensorenzurLadung = abstandSensorenzurLadung + i*14;
              let rotiereVektor = p.createVector(abstandSensorenzurLadung*p.cos((i+0.1)*(2*p.PI)/anzahlSensoren),abstandSensorenzurLadung*p.sin((i+0.1)*(2*p.PI)/anzahlSensoren));
              let zielOrtsVektor = p.createVector(p.width/2-150, p.height/2);
              let aktuellesensorKoord = p5.Vector.add(zielOrtsVektor, rotiereVektor);
              let sensorLokal = new ladungPrototyp(aktuellesensorKoord, sensorDurchmesser, 0);
              sensorArray.push(sensorLokal);
              abstandSensorenzurLadung = 30;
              abstandSensorenzurLadung = abstandSensorenzurLadung + i*18;
              zielOrtsVektor = p.createVector(p.width/2+150, p.height/2);
              aktuellesensorKoord = p5.Vector.add(zielOrtsVektor, rotiereVektor);
              sensorLokal = new ladungPrototyp(aktuellesensorKoord, sensorDurchmesser, 0);
              sensorArray.push(sensorLokal);                
            }            
          }
          break;  
        case 'Zwei versch. Ladungen':
          canvasZuruecksetzen();
          aktuelleLadungsKoord = p.createVector(p.width/2-150, p.height/2);    
          ladungLokal = new ladungPrototyp(aktuelleLadungsKoord, ladungsDurchmesser, 1);
          ladungsArray.push(ladungLokal);
          aktuelleLadungsKoord = p.createVector(p.width/2+150, p.height/2);    
          ladungLokal = new ladungPrototyp(aktuelleLadungsKoord, ladungsDurchmesser, -1);
          ladungsArray.push(ladungLokal);            
          anzahlSensoren = 5;
          abstandSensorenzurLadung = 30;
          for (let i = 0; i < anzahlSensoren; i++) {
            if (ladungsArray.length > 0) {
              abstandSensorenzurLadung = abstandSensorenzurLadung + i*14;
              let rotiereVektor = p.createVector(abstandSensorenzurLadung*p.cos((i+0.1)*(2*p.PI)/anzahlSensoren),abstandSensorenzurLadung*p.sin((i+0.1)*(2*p.PI)/anzahlSensoren));
              let zielOrtsVektor = p.createVector(p.width/2-150, p.height/2);
              let aktuellesensorKoord = p5.Vector.add(zielOrtsVektor, rotiereVektor);
              let sensorLokal = new ladungPrototyp(aktuellesensorKoord, sensorDurchmesser, 0);
              sensorArray.push(sensorLokal);
            }            
          }
          abstandSensorenzurLadung = 30;          
          for (let i = 0; i < anzahlSensoren; i++) {
            if (ladungsArray.length > 0) {
              abstandSensorenzurLadung = abstandSensorenzurLadung + i*14;
              let rotiereVektor = p.createVector(abstandSensorenzurLadung*p.cos((i+0.1)*(2*p.PI)/anzahlSensoren),abstandSensorenzurLadung*p.sin((i+0.1)*(2*p.PI)/anzahlSensoren));
              let zielOrtsVektor = p.createVector(p.width/2+150, p.height/2);
              let aktuellesensorKoord = p5.Vector.add(zielOrtsVektor, rotiereVektor);
              let sensorLokal = new ladungPrototyp(aktuellesensorKoord, sensorDurchmesser, 0);
              sensorArray.push(sensorLokal);
            }            
          }
          break;             
        case 'Kondensator':
          canvasZuruecksetzen();
          let kondensatorBreite = 200;
          let kondensatorHoehe = 240;
          let ladungsAnzahl = 10;
          for (let i = 0; i < ladungsAnzahl; i++) {
            let aktuelleLadungsKoord = p.createVector(p.width/2-kondensatorBreite/2+i*(kondensatorBreite/ladungsAnzahl), p.height/2-kondensatorHoehe/2);    
            let ladungLokal = new ladungPrototyp(aktuelleLadungsKoord, ladungsDurchmesser, -1);
            ladungsArray.push(ladungLokal);
            aktuelleLadungsKoord = p.createVector(p.width/2-kondensatorBreite/2+i*(kondensatorBreite/ladungsAnzahl), p.height/2+kondensatorHoehe/2);    
            ladungLokal = new ladungPrototyp(aktuelleLadungsKoord, ladungsDurchmesser, 1);
            ladungsArray.push(ladungLokal);
          }
          let sensorFeldBreite = 300;
          let sensorFeldHoehe = 230;
          let sensorAnzahl = 10;
          for (let i = 0; i < sensorAnzahl+1; i++) {
            if (ladungsArray.length > 0) {
              let aktuellesensorKoord = p.createVector(p.width/2-sensorFeldBreite/2+i*(sensorFeldBreite/sensorAnzahl),p.height/2-sensorFeldHoehe/2+i*sensorFeldHoehe/sensorAnzahl);    
              let sensorLokal = new ladungPrototyp(aktuellesensorKoord, sensorDurchmesser, 0);
              sensorArray.push(sensorLokal);
            }            
          }
          break;
        case 'Ladung vor Platte':
          canvasZuruecksetzen();
          let plattenBreite = 200;
          let plattenPosition = 240;
          let plattenladungsAnzahl = 10;
          for (let i = 0; i < plattenladungsAnzahl; i++) {
            let aktuelleLadungsKoord = p.createVector(p.width/2-plattenBreite/2+i*(plattenBreite/plattenladungsAnzahl), p.height/2-plattenPosition/2);    
            let ladungLokal = new ladungPrototyp(aktuelleLadungsKoord, ladungsDurchmesser, -1);
            ladungsArray.push(ladungLokal);
          }
          let plattensensorFeldBreite = 400;
          let plattensensorFeldHoehe = 230;
          let plattensensorAnzahl = 10;
          for (let i = 0; i < plattensensorAnzahl+1; i++) {
            if (ladungsArray.length > 0) {
              let aktuellesensorKoord = p.createVector(p.width/2-plattensensorFeldBreite/2+i*(plattensensorFeldBreite/plattensensorAnzahl),p.height/2-plattensensorFeldHoehe/2+i*plattensensorFeldHoehe/plattensensorAnzahl);    
              let sensorLokal = new ladungPrototyp(aktuellesensorKoord, sensorDurchmesser, 0);
              sensorArray.push(sensorLokal);
            }            
          }
          sensorArray[sensorArray.length-1].koordVec.y = sensorArray[0].koordVec.y;
          sensorArray[sensorArray.length-2].koordVec.y = sensorArray[2].koordVec.y;
          let einzelneLadungsKoord = p.createVector(p.width/2, p.height/2+80);    
          let einzelneladungLokal = new ladungPrototyp(einzelneLadungsKoord, ladungsDurchmesser, 1); 
          ladungsArray.push(einzelneladungLokal);
          break;
    }
    resultierendesVektorFeldBerechnen();
    feldlinienBerechnen(0);
    feldlinienBerechnen(p.PI);
    sollenAequisGemaltWerden();
    p.redraw();
  }    
  
  let quickSettingsBreite = 200;
  let RandOben = 18;
  let RandLinks = 18;
  let RandUnten = 18;
  let canvasBreite = 0;
  let canvasHoehe = 0;
  
  //GUI
  let dateinameSpeichern = 'efeld01';

  let deltaAequi;
  let deltaFeldlinien;
  
  let settings; 
  
  let probeladungStart01 = false;
  let probeladungStart02 = false; 
  let probeladungBewegen = false;
  let probeladungsCounter01 = 0;
  let probeladungsCounter02 = 0;  
  let resVektorenAnzeigen = false;
  let kraftVektorenAnzeigen = false;
  let kraefteAddition = false;  
  
  function onFileChosen(file){
    var ladeTextArray = [];
    var ladeText = '';
    var myFileReader = new FileReader();
    myFileReader.addEventListener("load", function(event) {
      ladeText = myFileReader.result;
      ladeTextArray = JSON.parse(ladeText);
      konfigurationLaden(ladeTextArray);        
    });    
    myFileReader.readAsText(file, "UTF-8");
  }
  
  p.setup = function() {
    canvasHoehe = p.windowHeight-2*RandUnten;
    
    if (p.windowWidth < maxActiveWide+1) {
      canvasBreite = p.windowWidth-quickSettingsBreite-RandLinks;
    }
    else { 
      canvasBreite = maxActiveWide-quickSettingsBreite-RandLinks;
    }
    
    let cnv = p.createCanvas(canvasBreite, canvasHoehe);
    cnv.position(quickSettingsBreite+35, RandOben);    
    p.frameRate(60);
    
    QuickSettings.useExtStyleSheet();
    settings = QuickSettings.create(15, 20, "Simulation: Elektrisches Feld");
    settings.setWidth(quickSettingsBreite);
  	settings.setDraggable(false);
  	settings.addRange("Ladungsmenge", 1, 10, ladungsmenge, 1, function(value) { ladungsmenge = value; });
  	settings.addButton("Negative Ladung", function() { ladungDazu(-1*ladungsmenge); });
  	  settings.overrideStyle("Negative Ladung", "width", "100%");
	    settings.overrideStyle("Negative Ladung", "background-color", "blue");	
	    settings.overrideStyle("Negative Ladung", "color", "white");  	  
  	settings.addButton("Positive Ladung", function() { ladungDazu(1*ladungsmenge); });
  	  settings.overrideStyle("Positive Ladung", "width", "100%");
	    settings.overrideStyle("Positive Ladung", "background-color", "red");	
	    settings.overrideStyle("Positive Ladung", "color", "white");  
  	settings.addBoolean("Vektorfeld", false, function(value) { vektorFeldBerechnenBool = value; });		    
  	settings.addButton("Sensor", function() { sensorDazu(); });	
  	  settings.overrideStyle("Sensor", "width", "100%");
	    settings.overrideStyle("Sensor", "background-color", "DarkGreen");	
	    settings.overrideStyle("Sensor", "color", "white");
  	settings.addBoolean("Kraft auf Probeladung", false, function(value) { kraftVektorenAnzeigen = value; });
  	settings.addBoolean("resultierende Kraft", false, function(value) { resVektorenAnzeigen = value; });
  	settings.addBoolean("Kräfte-Addition", false, function(value) { kraefteAddition = value; });  	    
  	settings.addButton("Probeladung Start/Stopp", function() { probeladungStarten(); });	
  	  settings.overrideStyle("Probeladung Start/Stopp", "width", "100%"); 
	    settings.overrideStyle("Probeladung Start/Stopp", "background-color", "White");	
	    settings.overrideStyle("Probeladungen starten", "color", "Black"); 
  	settings.addBoolean("Äquipotentiallinien", false, function(value) {
      aequipotBerechnenBool = value;
      if(aequipotBerechnenBool) {
        sollenAequisGemaltWerden();
      } else {
        aequipfadeArray = [];
      }
  	});	    
  	settings.addButton("Alles löschen", function() { canvasZuruecksetzen(); settings.setValuesFromJSON(defaultValues); });
  	  settings.overrideStyle("Alles löschen", "width", "100%");
    settings.addDropDown("Beispiele laden", ["", "Eine Ladung", "Zwei gleiche Ladungen", "Zwei versch. Ladungen", "Kondensator", "Ladung vor Platte"], function(value) { vordefinierteKonfigurationenLaden(value); });
  	settings.addText("Simulation benennen:", "efeld01", function(value) { dateinameSpeichern = value; });
    settings.addButton("Simulation speichern", function() { konfigurationSichern(); });
      settings.overrideStyle("Simulation speichern", "width", "100%");
  	settings.addFileChooser("Simulation laden", "Datei auswählen...", ".json", onFileChosen);
  	settings.addHTML("Elemente verändern", "<strong>Elemente bewegen:</strong></br>Anklicken - angeklickt bewegen. \n<br/><br/> <strong>Elemente löschen:</strong></br>Anklicken - warten. \n<br/></br> <strong>Probeladung starten:</strong></br>Sensorpfeil anklicken, Probeladung Start/Stopp.");
  	settings.hideTitle("Elemente verändern");
  	settings.addHTML("Version", "V3.02 - Pt");
  	settings.hideTitle("Version");  	
  	
  	var defaultValues = settings.getValuesAsJSON();
  };

  function sollenAequisGemaltWerden () {
    if (aequipotBerechnenBool) {
      let aequiBool = true;
      if (ladungsArray.length > 1) {
        for (let j = 0; j < ladungsArray.length; j++) {
          for (let k = 0; k < ladungsArray.length; k++) {
            if (j != k && ladungsArray[j].ladung != ladungsArray[k].ladung) { 
              let ladungsAbstand = p.dist(ladungsArray[j].koordVec.x, ladungsArray[j].koordVec.y, ladungsArray[k].koordVec.x, ladungsArray[k].koordVec.y);
              if(ladungsAbstand < (ladungsArray[k].durchmesser*1.1)) {
                aequiBool = false;
                aequipfadeArray = [];
                break;
              }
            }
          }
        }
      }
      for (let j = 0; j < sensorArray.length; j++) {
        for (let k = 0; k < ladungsArray.length; k++) {
          let sensorladungsAbstand = p.dist(sensorArray[j].koordVec.x, sensorArray[j].koordVec.y, ladungsArray[k].koordVec.x, ladungsArray[k].koordVec.y);
          if(sensorladungsAbstand < ladungsArray[k].durchmesser/1.5) {
            aequiBool = false;
            aequipfadeArray = [];
            break;
          }
        }
      }
      if (aequiBool) {
        aequipotentiallinienBerechnen();
      }
    }
  }

  function canvasZuruecksetzen() {
    p.background(240);
    ladungsArray = [];
    sensorArray = [];
    pfadeArray = [];
    andereRichtungPfadeArray = [];
    aequipfadeArray = [];    
    resultierendesVektorFeld = [];
  }

  let timerStart = 0;
  let timerWert = 0;
  let timerBool = false;
  let timerKoord;
  let timerFarbe = 100;
  let oldFrameKoord;
  let newFrameKoord;
  let lastFrameKoord;

  p.mousePressed = function () {
    newFrameKoord = p.createVector(p.mouseX, p.mouseY);
    timerBool = true;
    timerKoord = p.createVector(p.mouseX, p.mouseY);
    timerStart = p.millis();
  };

  p.mouseReleased = function () {
    timerBool = false;
    timerWert = 0;
    timerFarbe = 255;
    oldFrameKoord = p.createVector(p.mouseX, p.mouseY);
  };

  function probeladungStarten() {
    if(probeladungBewegen) {
      probeladungBewegen = false;
    }
    else {
      if(sensorArray.length > 0) {
        probeladungBewegen = true;
        if(probeladungStart01 == false && probeladungStart02 == false) { probeladungStart01 = true; 
        }
      }
    }
  }
  
  p.draw = function() {
    p.background(252);

    p.push();
      p.stroke(240);
      p.strokeWeight(8);
      p.line(0,0,0,canvasHoehe);
      p.line(0,canvasHoehe,canvasBreite,canvasHoehe);
      p.line(0,0,canvasBreite,0);
      p.line(canvasBreite,0,canvasBreite,canvasHoehe);
    p.pop();
    
    deltaAequi = 5;
    deltaFeldlinien = 2;
    
    if (p.mouseIsPressed) {
      newFrameKoord = p.createVector(p.mouseX, p.mouseY);
      lastFrameKoord = p.createVector(p.pmouseX, p.pmouseY);      
      if (!ladungBewegen) {
        if (lastFrameKoord.equals(oldFrameKoord)) {
          lastFrameKoord = p.createVector(p.mouseX, p.mouseY);
        }
        for (let i = 0; i < sensorArray.length; i++) {
          let abstand = p.dist(lastFrameKoord.x, lastFrameKoord.y, sensorArray[i].koordVec.x, sensorArray[i].koordVec.y);
          if (abstand < sensorDurchmesser/2) {
            sensorBewegen = true;
            //die gefundene Ladung wird an den Anfang des Ladungsarray geschoben
            sensorArray = arrayMoveElement(sensorArray, i, 0);
            if (newFrameKoord.x < 0) { newFrameKoord.x = 10 }
            if (newFrameKoord.x > p.width) { newFrameKoord.x = p.width-10 }
            if (newFrameKoord.y < 0) { newFrameKoord.y = 10 }
            if (newFrameKoord.y > p.height) { newFrameKoord.y = p.height-10 }
            sensorArray[0].verschieben(newFrameKoord);
            if (timerBool && timerKoord.equals(newFrameKoord)) { 
              timerWert = p.millis() - timerStart;
              timerFarbe = timerFarbe - 255/30;
            }
            //Markierung des zu bewegenden Sensors
            p.push();
            p.stroke(0,timerFarbe,0);
            p.strokeWeight(5);
            p.noFill();
            let richtungVec = efeldvektor_an_koord_Berechnen(sensorArray[0].koordVec,-p.PI/2);
            let richtungsWinkel = richtungVec.heading();
            p.translate(sensorArray[0].koordVec.x, sensorArray[0].koordVec.y);
            p.rotate(richtungsWinkel);
            p.line(-8,-10,0,0);
            p.line(8,-10,0,0);
            //p.ellipse(aktuelleKoord.x,aktuelleKoord.y,sensorDurchmesser+3,sensorDurchmesser+3);
            p.pop();            
            if (timerWert > 1000) {
              sensorArray.splice(0,1);
            }            
            feldlinienBerechnen(0);
            feldlinienBerechnen(p.PI);
            sollenAequisGemaltWerden();
            break;
          }
        }      
      }
      if (!sensorBewegen) {
        if (lastFrameKoord.equals(oldFrameKoord)) {
          lastFrameKoord = p.createVector(p.mouseX, p.mouseY);
        }        
        for (let i = 0; i < ladungsArray.length; i++) {
          let abstand = p.dist(lastFrameKoord.x, lastFrameKoord.y, ladungsArray[i].koordVec.x, ladungsArray[i].koordVec.y);
          if (abstand < ladungsArray[i].durchmesser/2) {
            ladungBewegen = true;
            //die gefundene Ladung wird an den Anfang des Ladungsarray geschoben
            ladungsArray = arrayMoveElement(ladungsArray, i, 0);
            if (newFrameKoord.x < 0) { newFrameKoord.x = 0 }
            if (newFrameKoord.x > p.width) { newFrameKoord.x = p.width }
            if (newFrameKoord.y < 0) { newFrameKoord.y = 0 }
            if (newFrameKoord.y > p.height) { newFrameKoord.y = p.height }            
            ladungsArray[0].verschieben(newFrameKoord); 
            if (timerBool && timerKoord.equals(newFrameKoord)) { 
              timerWert = p.millis() - timerStart;
              timerFarbe = timerFarbe - 255/30;
            }
            //Markierung der zu bewegenden Ladung
            p.push();
            p.stroke(0,timerFarbe,0);
            p.strokeWeight(10);
            p.noFill();
            p.ellipse(newFrameKoord.x,newFrameKoord.y,ladungsArray[i].durchmesser+3,ladungsArray[i].durchmesser+3);
            p.pop();              
            if (timerWert > 1000) {
              ladungsArray.splice(0,1);
              if (ladungsArray.length === 0) {
                sensorArray = [];
              }
            }            
            resultierendesVektorFeldBerechnen();
            if (ladungsArray.length > 0) {
              feldlinienBerechnen(0);
              feldlinienBerechnen(p.PI);
              sollenAequisGemaltWerden();
            }
            else {
              canvasZuruecksetzen();
            }
            break;
          }
        }
      }
    }
    else {
      sensorBewegen = false;
      ladungBewegen = false;
    }
    if (resultierendesVektorFeld.length > 0 && vektorFeldBerechnenBool) {
      for (let i = 0; i < resultierendesVektorFeld.length; i++) {
        p.push();
        p.translate(resultierendesVektorFeld[i].koord.x, resultierendesVektorFeld[i].koord.y);
        p.rotate(resultierendesVektorFeld[i].richtung+p.PI/2);
        let alphaWert = p.map(resultierendesVektorFeld[i].laenge, 0, 50, 100, 255);
        p.stroke(240, 180, 170, alphaWert);
        p.line(0, 0, 0, 10);  
        p.pop();
      }
    }
    p.push();
    if (ladungsArray.length > 0) {
      for (let i = 0; i < ladungsArray.length; i++) {
        if (ladungsArray[i].ladung < 0) {
          p.fill('blue');
          p.stroke('blue');        
        }
        else {
          p.fill('red');
          p.stroke('red');        
        }
      ladungsArray[i].zeichnen();
      }
    }    
    p.pop();
    p.push();
    p.fill('green');
    p.stroke('green');
    if (sensorArray.length > 0) {
      for (let i = 0; i < sensorArray.length; i++) {
          let richtungVec = efeldvektor_an_koord_Berechnen(sensorArray[i].koordVec,-p.PI/2);
          p.push();
          p.strokeWeight(2);
          let richtungsWinkel = richtungVec.heading();
          p.translate(sensorArray[i].koordVec.x, sensorArray[i].koordVec.y);
          p.rotate(richtungsWinkel);
          p.line(-8,-10,0,0);
          p.line(8,-10,0,0);
          p.pop();
      }
    }    
    p.pop();
    p.push();
    p.stroke('DarkGreen');
    if (pfadeArray.length > 0) {
      for (let i = 0; i < pfadeArray.length; i++) {
          for (let j = 0; j < pfadeArray[i].length; j++) {
            if (j < pfadeArray[i].length-1) {
              p.line(pfadeArray[i][j].x,pfadeArray[i][j].y,pfadeArray[i][j+1].x,pfadeArray[i][j+1].y);
            }            
          }
      }
    }
    p.pop(); 
    p.push();
    p.stroke('DarkGreen');
    if (andereRichtungPfadeArray.length > 0) {
      for (let i = 0; i < andereRichtungPfadeArray.length; i++) {
          for (let j = 0; j < andereRichtungPfadeArray[i].length; j++) {
            if (j < andereRichtungPfadeArray[i].length-1) {
              p.line(andereRichtungPfadeArray[i][j].x,andereRichtungPfadeArray[i][j].y,andereRichtungPfadeArray[i][j+1].x,andereRichtungPfadeArray[i][j+1].y);
            }
          }
      }
    }
    p.pop();     
    p.push();
    p.stroke('MediumTurquoise');
    if (aequipfadeArray.length > 0) {
      for (let i = 0; i < aequipfadeArray.length; i++) {
          for (let j = 0; j < aequipfadeArray[i].length; j++) {
            if (j < aequipfadeArray[i].length-1) {
              p.line(aequipfadeArray[i][j].x,aequipfadeArray[i][j].y,aequipfadeArray[i][j+1].x,aequipfadeArray[i][j+1].y);
            }
          }
      }
    }
    p.pop();
    
    if(probeladungStart01) {
      if (pfadeArray.length > 0) {
            if(probeladungsCounter01 < andereRichtungPfadeArray[0].length-1) {
              p.push();
              p.strokeWeight(2);
              p.stroke('gray');
              probeLadungVektorenberechnen(andereRichtungPfadeArray[0][andereRichtungPfadeArray[0].length-1-probeladungsCounter01].x, andereRichtungPfadeArray[0][andereRichtungPfadeArray[0].length-1-probeladungsCounter01].y);
              p.pop();
            }
            else { 
              probeladungsCounter01 = 0;
              probeladungStart01 = false;
              probeladungStart02 = true;
            }
      }
    }
    if(probeladungStart02) {
      if(probeladungsCounter02 < pfadeArray[0].length-1) {
          p.push();
          p.strokeWeight(2);
          p.stroke('gray');
          probeLadungVektorenberechnen(pfadeArray[0][probeladungsCounter02].x, pfadeArray[0][probeladungsCounter02].y);
          p.pop();
        }
        else { 
              probeladungsCounter02 = 0;
              probeladungStart01 = false;
              probeladungStart02 = false;
              probeladungBewegen = false;
        }        
    }
    if(probeladungBewegen) {
      if(probeladungStart01) { probeladungsCounter01++; }
      if(probeladungStart02) { probeladungsCounter02++; }
    }
  };

  function probeLadungVektorenberechnen(probeladungX, probeladungY) {
    p.ellipse(probeladungX, probeladungY, 20, 20);
    let probeladungOrtsvektor = p.createVector(probeladungX, probeladungY)
    let summenVektor = p.createVector(0,0);
    let kraftaufprobeladungArray = [];
      for (let i = ladungsArray.length-1; i > -1; i--) {
          //Entfernung als Laenge des Differenzvektors
          let entfernung = p5.Vector.sub(ladungsArray[i].koordVec,probeladungOrtsvektor).mag();
          if (entfernung < ladungsArray[i].durchmesser) {
            entfernung = ladungsArray[i].durchmesser;
          }
          //Ladung in nC
          let laenge = (9 * ladungsArray[i].ladung / p.pow(entfernung,2) * 100000);
          let richtung = p5.Vector.sub(probeladungOrtsvektor,ladungsArray[i].koordVec).heading();
          let tempVektor = p.createVector(laenge * p.cos(richtung), laenge * p.sin(richtung));
          kraftaufprobeladungArray.push(tempVektor);
          summenVektor = p5.Vector.add(tempVektor, summenVektor);
        }
    let offset = 10;
		if(resVektorenAnzeigen){
				p.strokeWeight(3);
				p.stroke('#5A2572');
				p.fill('#5A2572');
			p.line(probeladungX, probeladungY, probeladungX + summenVektor.x, probeladungY + summenVektor.y);
	    p.push();
		    let angle = p.atan2(summenVektor.y, summenVektor.x);
		    p.translate(probeladungX + summenVektor.x, probeladungY + summenVektor.y);
		    p.rotate(angle+p.HALF_PI);
		    p.triangle(-offset*0.5, offset, offset*0.5, offset, 0, 0);
	    p.pop();			
		}
		if(kraftVektorenAnzeigen) {
		  offset = 5;
			for(let j = 0; j < kraftaufprobeladungArray.length; j++){
				p.strokeWeight(2);
				p.stroke('darkgrey');
				p.fill('darkgrey');
				p.line(probeladungX, probeladungY, probeladungX + kraftaufprobeladungArray[j].x, probeladungY + kraftaufprobeladungArray[j].y);		
	 	    p.push();
			    let angle = p.atan2(kraftaufprobeladungArray[j].y, kraftaufprobeladungArray[j].x);
			    p.translate(probeladungX + kraftaufprobeladungArray[j].x, probeladungY + kraftaufprobeladungArray[j].y);
			    p.rotate(angle+p.HALF_PI);
			    p.triangle(-offset*0.5, offset, offset*0.5, offset, 0, 0);
		    p.pop();				
			}
		}
		if(kraefteAddition) {
			p.push();				
				p.translate(probeladungX, probeladungY);
				for(let j = 0; j < kraftaufprobeladungArray.length; j++){
					p.strokeWeight(2);
					p.stroke('wheat');
					p.fill('wheat');
					p.line(0, 0, kraftaufprobeladungArray[j].x, kraftaufprobeladungArray[j].y);	
		 	    p.push();
				    let angle = p.atan2(kraftaufprobeladungArray[j].y, kraftaufprobeladungArray[j].x);
				    p.translate(kraftaufprobeladungArray[j].x, kraftaufprobeladungArray[j].y);
				    p.rotate(angle+p.HALF_PI);
				    p.triangle(-offset*0.5, offset, offset*0.5, offset, 0, 0);
			    p.pop();
			    p.translate(kraftaufprobeladungArray[j].x, kraftaufprobeladungArray[j].y);
				}
			p.pop();
		}		
  }

  //schiebe das gewählte Element an die gewünschte Position 
  function arrayMoveElement(arry, altIndex, neuIndex) {
      if (neuIndex >= arry.length) {
          var k = neuIndex - arry.length + 1;
          while (k--) {
              arry.push(undefined);
          }
      }
      arry.splice(neuIndex, 0, arry.splice(altIndex, 1)[0]);
      return arry;
  } 
  
  function sensorDazu() {
    if (ladungsArray.length > 0) {
      let aktuellesensorKoord = p.createVector(p.width/2+p.random(-p.width/3,p.width/3), p.height/2-p.random(-p.height/3,p.height/3));    
      let sensorLokal = new ladungPrototyp(aktuellesensorKoord, sensorDurchmesser, 0);
      sensorArray.push(sensorLokal);
      feldlinienBerechnen(0);
      feldlinienBerechnen(p.PI);
      sollenAequisGemaltWerden();
    }
  }
  
  function ladungDazu(ladungsWert) {
      let aktuelleLadungsKoord = p.createVector(p.width/2+p.random(-p.width/5,p.width/5), p.height/2+p.random(-p.height/5,p.height/5));
      let tempDurchmesser = p.pow(1.1,p.abs(ladungsWert)) * ladungsDurchmesser;
      let ladungLokal = new ladungPrototyp(aktuelleLadungsKoord, tempDurchmesser, ladungsWert);
      ladungsArray.push(ladungLokal);
      resultierendesVektorFeldBerechnen();
      feldlinienBerechnen(0);
      feldlinienBerechnen(p.PI);
      sollenAequisGemaltWerden();
  }  
  
  function efeldvektor_an_koord_Berechnen(lokalSensor,rotiereVektor) {
    let lokalVektorArray = [];
    let lokalResultierenderVektor = p.createVector(0,0);
    for (let j = 0; j < ladungsArray.length; j++) {
      let lokalEntfernungsVektor = p5.Vector.sub(lokalSensor,ladungsArray[j].koordVec);
      //laenge Vektor p5.Vector.mag()
      let lokalEntfernung = lokalEntfernungsVektor.mag();
      let lokalLaenge = (9 * ladungsArray[j].ladung / p.pow(lokalEntfernung,2) * 1000);
      lokalEntfernungsVektor.setMag(lokalLaenge);
      lokalVektorArray.push(lokalEntfernungsVektor);
    }
    for (let k = 0; k < lokalVektorArray.length; k++) {
      lokalResultierenderVektor.add(lokalVektorArray[k]);
    }
    lokalResultierenderVektor.rotate(rotiereVektor);
    return lokalResultierenderVektor;
  }
  
  function rungeKutta4(lokalPfadArray, lokalstep, lokalVecRotate, lokalDelta) {
          //Runge-Kutta 4. Ordnung
        //vec_k_1 = v(x_i);
        let vec_k_1 = efeldvektor_an_koord_Berechnen(lokalPfadArray[lokalstep], lokalVecRotate);        
        let d_t = lokalDelta/(vec_k_1.mag());
        
        //vec_k_2 = v(x_i + 0.5 d_t * vec_k_1)
        let vec_k_2_helper1 = p.createVector(0,0);
        vec_k_2_helper1.add(vec_k_1);
        vec_k_2_helper1.mult(0.5*d_t);
        let vec_k_2_helper2 = p5.Vector.add(lokalPfadArray[lokalstep],vec_k_2_helper1);
        let vec_k_2 = efeldvektor_an_koord_Berechnen(vec_k_2_helper2, lokalVecRotate);

        //vec_k_3 = v(x_i + 0.5 d_t * vec_k_2)
        let vec_k_3_helper1 = p.createVector(0,0);
        vec_k_3_helper1.add(vec_k_2);
        vec_k_3_helper1.mult(0.5*d_t);
        let vec_k_3_helper2 = p5.Vector.add(lokalPfadArray[lokalstep],vec_k_3_helper1);
        let vec_k_3 = efeldvektor_an_koord_Berechnen(vec_k_3_helper2, lokalVecRotate);
        
        //vec_k_4 = v(x_i + d_t * vec_k_3)
        let vec_k_4_helper1 = p.createVector(0,0);
        vec_k_4_helper1.add(vec_k_3);
        vec_k_4_helper1.mult(d_t);
        let vec_k_4_helper2 = p5.Vector.add(lokalPfadArray[lokalstep],vec_k_4_helper1);
        let vec_k_4 = efeldvektor_an_koord_Berechnen(vec_k_4_helper2, lokalVecRotate);        
        
        //sensorKoordNeu = sensorKoordAlt + 1/6*d_t*(vec_k_1+2*vec_k_2+2*vec_k_3+vec_k_4)
        let vec_ziel_helper = p5.Vector.add(vec_k_1,vec_k_2.mult(2));
        vec_ziel_helper.add(vec_k_3.mult(2));
        vec_ziel_helper.add(vec_k_4);
        vec_ziel_helper.mult(1/6*d_t);
        vec_ziel_helper.add(lokalPfadArray[lokalstep]);
        
        return vec_ziel_helper;
  }   
  
  function feldlinienBerechnen(rotiereVektor) {
    if (rotiereVektor === 0) {  
      pfadeArray = []; 
    }
    else {
      andereRichtungPfadeArray = [];
    }
    for (let i = 0; i < sensorArray.length; i++) {
      sensorPfadArray[0] = sensorArray[i].koordVec;
 
      let abstandOK = true;
      let step = 0;
      do {
        for (let j = 0; j < ladungsArray.length; j++) { 
          let abstand = p.dist(sensorPfadArray[sensorPfadArray.length-1].x, sensorPfadArray[sensorPfadArray.length-1].y, ladungsArray[j].koordVec.x, ladungsArray[j].koordVec.y);
          if (abstand > (ladungsArray[j].durchmesser/2+3) && abstand < 1500) { abstandOK = true } else { abstandOK = false; break; }
        }          
        sensorPfadArray.push(rungeKutta4(sensorPfadArray, step, rotiereVektor, deltaFeldlinien));
        step++;
      } while (abstandOK);
      if (rotiereVektor === 0) { 
        pfadeArray.push(sensorPfadArray);
      }
      else {
        andereRichtungPfadeArray.push(sensorPfadArray);
      }
      sensorPfadArray = [];
    }
  }
  
  function aequipotentiallinienBerechnen() {
    aequipfadeArray = [];
    for (let i = 0; i < sensorArray.length; i++) {
      aequipotentialfeldPfadArray[0] = sensorArray[i].koordVec;
      let abstandOK = true;
      let helperBool = true;
      let step = 0;
      do {
          let abstand = p.dist(aequipotentialfeldPfadArray[aequipotentialfeldPfadArray.length-1].x, aequipotentialfeldPfadArray[aequipotentialfeldPfadArray.length-1].y, aequipotentialfeldPfadArray[0].x, aequipotentialfeldPfadArray[0].y);
          if (abstand < 5 && step > 10) { abstandOK = false; break; } else { abstandOK = true; }
          aequipotentialfeldPfadArray.push(rungeKutta4(aequipotentialfeldPfadArray, step, p.PI/2, deltaAequi));
          step++;
          if (aequipotentialfeldPfadArray.length > 5000) { helperBool = false }
      } while (abstandOK && helperBool);
      aequipfadeArray.push(aequipotentialfeldPfadArray);
      aequipotentialfeldPfadArray = [];
    }
  }  
  
  function resultierendesVektorFeldBerechnen() {
    let gridArray = [];  
    let deltaGrid = 30; 
    let yAnzahlGridPunkte = p.floor(p.height/deltaGrid);
    let xAnzahlGridPunkte = p.floor(p.width/deltaGrid);
    for (let i = 0; i < yAnzahlGridPunkte; i++) {
      for (let j = 0; j < xAnzahlGridPunkte; j++) {
        let vec01 = p.createVector(xRand + j*deltaGrid, yRand + i*deltaGrid);
        gridArray.push(vec01);
      }
    }    
    for (let j = 0; j < gridArray.length; j++) {
      let summenVektor = p.createVector(0,0);
      for (let i = ladungsArray.length-1; i > -1; i--) {
          //Entfernung als Laenge des Differenzvektors
          let entfernung = p5.Vector.sub(ladungsArray[i].koordVec,gridArray[j]).mag();
          if (entfernung < ladungsArray[i].durchmesser) {
            entfernung = ladungsArray[i].durchmesser;
          }
          //Ladung in nC
          let laenge = (9 * ladungsArray[i].ladung / p.pow(entfernung,2) * 10000);
          let richtung = p5.Vector.sub(ladungsArray[i].koordVec,gridArray[j]).heading();
          let tempVektor = p.createVector(laenge * p.cos(richtung), laenge * p.sin(richtung));
          summenVektor = p5.Vector.add(tempVektor, summenVektor);
        }      
        let vektorLokal = new efeldVektorPrototyp(gridArray[j],summenVektor.mag(),summenVektor.heading());
        resultierendesVektorFeld[j] = vektorLokal;
      } 
  }

  function konfigurationSichern() {
    let speicherArray = [];
    function speicherObjekt(xKoord, yKoord, ladung) {
      this.xKoord = xKoord;
      this.yKoord = yKoord;      
      this.ladung = ladung;
    }
    for (let i = 0; i < ladungsArray.length; i++) {
      let lokalSpeicherObjekt = new speicherObjekt(ladungsArray[i].koordVec.x, ladungsArray[i].koordVec.y, ladungsArray[i].ladung);
      speicherArray.push(lokalSpeicherObjekt);
    }
    for (let i = 0; i < sensorArray.length; i++) {
      let lokalSpeicherObjekt = new speicherObjekt(sensorArray[i].koordVec.x, sensorArray[i].koordVec.y, sensorArray[i].ladung);
      speicherArray.push(lokalSpeicherObjekt);      
    }
    let dateiName = dateinameSpeichern + '.json';
    p.saveJSON(speicherArray, dateiName);
  }
  
  function konfigurationLaden(ladeTextArray) {
    if (ladeTextArray.length > 0) {
      canvasZuruecksetzen();
      try {
        for (let i = 0; i < ladeTextArray.length; i++) {
          let geladeneLadungsKoord = p.createVector(ladeTextArray[i].xKoord, ladeTextArray[i].yKoord);
          if (ladeTextArray[i].ladung === 0) {
            let ladungSensorLokal = new ladungPrototyp(geladeneLadungsKoord, sensorDurchmesser, ladeTextArray[i].ladung);
            sensorArray.push(ladungSensorLokal);
          }
          else {
            let tempDurchmesser = p.pow(1.1,p.abs(ladeTextArray[i].ladung)) * ladungsDurchmesser;
            let ladungSensorLokal = new ladungPrototyp(geladeneLadungsKoord, tempDurchmesser, ladeTextArray[i].ladung);
            ladungsArray.push(ladungSensorLokal);
          }
        }
        resultierendesVektorFeldBerechnen();
        feldlinienBerechnen(0);
        feldlinienBerechnen(p.PI);
        sollenAequisGemaltWerden();
        p.redraw();
        ladeTextArray = [];        
      }
      catch(err) {
      }
    }
  }    

};

var efeldApp = new p5(p5sketch,'p5-program');