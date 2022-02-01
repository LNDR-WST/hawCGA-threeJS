 ██████  ██████   █████
██      ██       ██   ██
██      ██   ███ ███████
██      ██    ██ ██   ██
 ██████  ██████  ██   ██


██████  ███████ ███    ███  ██████  ███    ██ ███████ ████████ ██████   █████  ████████  ██████  ██████
██   ██ ██      ████  ████ ██    ██ ████   ██ ██         ██    ██   ██ ██   ██    ██    ██    ██ ██   ██ ██
██   ██ █████   ██ ████ ██ ██    ██ ██ ██  ██ ███████    ██    ██████  ███████    ██    ██    ██ ██████
██   ██ ██      ██  ██  ██ ██    ██ ██  ██ ██      ██    ██    ██   ██ ██   ██    ██    ██    ██ ██   ██ ██
██████  ███████ ██      ██  ██████  ██   ████ ███████    ██    ██   ██ ██   ██    ██     ██████  ██   ██


████████ ██    ██ ██████  ███    ██ ████████  █████  ██████  ██      ███████
   ██    ██    ██ ██   ██ ████   ██    ██    ██   ██ ██   ██ ██      ██
   ██    ██    ██ ██████  ██ ██  ██    ██    ███████ ██████  ██      █████                       ╔╦╗┬ ┬┬─┐┌─┐┌─┐  ┬┌─┐
   ██    ██    ██ ██   ██ ██  ██ ██    ██    ██   ██ ██   ██ ██      ██                           ║ ├─┤├┬┘├┤ ├┤   │└─┐
   ██     ██████  ██   ██ ██   ████    ██    ██   ██ ██████  ███████ ███████                      ╩ ┴ ┴┴└─└─┘└─┘o└┘└─┘
                                                                                                            02.02.2022
########################################################################################################################
## CGA Demontrator: Turntable
################################

-------
LEANDER WERNST (2555900)
Media Systems, 4. Semester (WiSe 2021)
-------------------------------------------------------
Kurs:

Computergrafik & Animation (Prof. Dr. Jan A. Neuhöfer)
Hochschule für Angewandte Wissenschaften Hamburg
Fakultät Design, Medien und Information


########################################################################################################################
## INHALT
################################

1. Projektbeschreibung
2. How to run
3. Features
4. Credits/Externe Quellen


########################################################################################################################
## 1. PROJEKTBESCHREIBUNG
################################

Das Projekt ist im Rahmen des Kurses "Computergrafik & Animation" im 4. Semester "Media Systems" an der Hochschule für
Angewandte Wissenschaften Hamburg mit Betreuung durch Prof. Dr. Jan A Neuhöfer entstanden.

Die Aufgabe des Projekts war, einen Three.js-Demonstrator zu entwickeln, in dem die im Kurs vermittelten Inhalte
angewandt werden, um ein aus einer GLTF-Datei geladenes Modell (selbst oder nicht selbst erstellt) aus
Three.js-Grundkörpern, Freiformgeometrien, Extrusionen, Constructive Solid Geometries etc. nachzubauen.
Das nachgebaute Modell sollte aus mindestens 10 Einzelteilen unter Verwendung von Materialien und Texturen bestehen und
durch verschiedene Funktionen, Animationen und Physik auf Benutzereingaben reagieren.

Zur Realisierung durften ausschließlich die in der Vorlesung genutzten Bibliotheken verwendet werden, die über
dieselben Pfade wie in den Kursbeispielen geladen werden sollen.
Darunter:
- Cannon.es 0.18.0
- Cannon.es Debugger 0.1.4
- Dat.Gui 0.7.7
- Three.js r134
- Three.csg 2020
- Tween.js 18.6.4

Hauptbestandteil des hier realisierten Demonstrators ist der (rechte) Plattenspieler, welcher auf Grundlage des linken,
von einer externen Quelle (siehe Punkt 4: Credits/externe Quellen) stammenden, Plattenspielers entstanden ist.
Bei der Originaldatei des geladenen Plattenspielers handelte es sich um eine FBX-Datei, die mithilfe der Software
Blender in das geforderte GLTF exportiert wurde. In diesem Zuge wurden die Texturen sowie Farbgebungen leicht angepasst
und Animationen erstellt. Die Geometrien selbst blieben unverändert.
Die (angepassten) Texturen des geladenen Plattenspielers wurden im Großen und Ganzen ebenfalls für den Nachbau in
Three.js verwendet.

Für ein stimmigeres Gesamtbild wurden die Plattenspieler zusammen mit zwei Lautsprechern auf einem Möbelstück platziert.
Diese Modelle stammen ebenfalls aus einer externen Quelle, wurden nur minimal korrigiert und wie die Vorlage des
Plattenspielers als GLTF in die Three.js-Szene geladen.


########################################################################################################################
## 2. HOW TO RUN
################################

Damit die Bibliotheken gemäß der Struktur der Vorlesung korrekt geladen werden können, muss die folgende Struktur
eingehalten werden:
Der Ordner "demonstrator_wernst-leander" muss in einem übergeordneten Ordner abgelegt werden, der zusammen mit dem
(hier nicht enthaltenen) Ordner "lib", in dem die einzelnen oben genannten Bibliotheken enthalten sind, auf einer Ebene
liegt. "demonstrator_wernst-leander" beinhaltet somit dieselbe Ordnerstruktur wie ein "Zwischenstand" aus der Vorlesung
("intermediate_xy").

Benötigte Ordnerstruktur:

├───uebergeordneter_ordner
│   └───demonstrator_wernst-leander             <------ !
│       └───src
│           ├───eventfunctions
│           ├───images
│           ├───models
│           ├───music
│           ├───objects
│           └───physics
└───lib
    ├───cannon-es-0.18.0
    ├───cannon-es-debugger-0.1.4
    ├───dat.gui-0.7.7
    ├───three.js-r134
    ├───three-csg-2020
    └───tween.js-18.6.4

Die in dem Ordner "src" befindliche Datei "index.html" muss von einem Server angefordert werden, der diese dann an den
Client sendet. Wie in der Vorlesung wurde dies zur Entwicklung mit der lokalen Serverumgebung realisiert, die die
integrierte Entwicklungsumgebung "WebStorm"  (JetBrains) von Haus aus bereitstellt.

########################################################################################################################
## 3. FEATURES
################################

********************
**     KAMERA     **
********************
Mithilfe der Maus kann die Kamera innerhalb der Szene bewegt werden (Orbit Controls).

- Linke Maustaste:    Rotation
- Mausrad:            Zoom
- Rechte Maustaste    Pan


********************
** PLATTENSPIELER **
********************

Beide Plattenspieler können durch Mausklicks (linke Maustaste) gesteuert werden.
Dabei sind folgende Aktionen möglich:

- On-Off-Switch:      Einschalten des Plattenspielers (rotes Licht als Indikator am Power-Switch)
- Start/Stop-Button:  Starten/Stoppen der Drehschreibe
- Nadellicht:         Hoch- und Runterdrücken des Nadellichtzylinders (links runter, rechts hoch)
- 45/33 RPM Buttons:  Ändern der Abspielgeschwindigkeit
- Arm:                Ein Klick auf den Arm senkt bzw. hebt diesen (wenn die Platte nicht läuft)

Läuft der Plattenspieler (Drehscheibe mit Platte drehen sich) und befindet sich der Arm bzw. dessen Nadel auf der
Schallplatte, wird Musik abgespielt. Beide Plattenspieler spielen unabhängig voneinander dieselbe Musik ab.
Ist die Musik zuende, die Nadel aber weiterhin auf der Schallplatte und dreht sich die Scheibe weiterhin, hört man
die Platte rauschen/knacken.
Die Abspielgeschwindigkeit des Sounds kann verändert werden, die sichtbare Drehgeschwindigkeit bleibt dieselbe.


********************
**  LAUTSPRECHER  **
********************

Die Lautsprecher geben die von den Plattenspielern abgespielte Musik wieder. Sie sind mit "Positional Audio" so
eingestellt, dass der gut hörbare Bereich auch vor diesen Lautsprechern liegt.Bewegt sich die Kamera hinter die
Lautsprecher oder sehr weit von diesen weg, nimmt die Lautstärke der Sounds ab.


********************
**     PHYSIK     **
********************

Die Szene und die sich darin befindenden Objekte sind mit physikalischen Eigenschaften ausgestattet (Schwerkraft und
Masse). Um Kollisionen zu verursachen können mit einem Klick auf die Leertaste Tennisbälle geschossen werden.
Die Flugrichtung der Tennisbälle orientiert sich ausgehend von der Kamera an der aktuellen Mauszeigerposition, wodurch
grob gezielt werden kann.

- Leertaste + Mauszeiger:   Schuss/Wurf eines Tennisballs

Die Plattenspieler sowie die Lautsprecher sind dynamische Körper, d.h. sie reagieren auf Kollisionen und werden von
diesen beeinflusst. Der Schranktisch hingegen ist statisch: Objekte kollidieren mit diesem Körper, der Körper selbst
reagiert aber nicht auf diese Kollisionen. Hintergrund ist, dass aufeinander gestapelte Boxen mit physikalischen
Eigenschaften (Cannon.js) sehr unstabil sind und auf Dauer nicht still stehen (somit darauf platzierte Objekte mit der
Zeit herunterfallen).
Das Problem lässt sich auch in einem der offiziellen Beispiele nachvollziehen:
http://schteppe.github.io/cannon.js/demos/convex.html ("convex on convex").


********************
**       GUI      **
********************

Light Color & Light Intensity
---
Das Lichtsetting lässt sich mit dem sich am rechten oberen Rand befindlichen Graphic User Interface einstellen.
Die Position der Lichtquellen ist dabei fest, je ein Spotlight verfolgt aber einen der Plattenspieler.
Die Lichtstimmung kann über die Intensität der vorhandenen Lichtquellen sowie die Farbgebung (getrennte RGB-Werte, wobei
die Werte 0-1 in dem GUI die RGB-Werte von 0-255 abbilden.

General
---
Über die Buttons dem Bereich "General" lassen sich die Positionen der Objekte zurücksetzen, geschossene Tennisbälle
wieder entfernen (z.B. bei Performance-Einbrüchen) und die Objekte als Wireframe anzeigen (entweder alle oder nur den
nachgebauten Plattenspieler).
Der Taste "Stop Aud&Anim" stoppt alle laufenden Tweens und pausiert laufende Audiospuren.


########################################################################################################################
## 4. CREDITS/EXTERNE QUELLEN
################################

***************************
** Modell Plattenspieler **
***************************
- turntable.gltf (bearbeitet)

Inklusive Texturen (bearbeitet):
- rotaryRing_base.jpg
- rotaryRing_normal.jpg
- turntabletop.jpg
- weighttext.jpg

Quelle:
------
Sketchfab.com, "MK2 1210 Turntable - Old" by GRIP420
https://sketchfab.com/3d-models/mk2-1210-turntable-old-201817db6b0d45c29ead1b3b65b33b94
CC Attribution


***************************
**  Lautsprecher-Modell  **
***************************
- speaker.gltf (bearbeitet)

Quelle:
------
Sketchfab.com, "Speaker" by futuba@blender
https://sketchfab.com/3d-models/speaker-998d4fc1513745eaafe8bb3d6e3d1032
CC Attribution


***************************
**    Modell "Cabinet"   **
***************************
- woodencabinet.gltf (bearbeitet)

Quelle:
------
Sketchfab.com, "TV Cabinet Andersen" by 3D Share
https://sketchfab.com/3d-models/tv-cabinets-andersen-a225d196dd7c4b50a140ecfc22bcb284
CC Attribution


***************************
**    Sound Crackling    **
***************************
- crackling.mp3

Quelle:
------
99Sounds.com, "Vinyl Noise SFX" by Chia
https://99sounds.org/vinyl-noise-sfx/


***************************
**         Musik         **
***************************
- music.mp3

Quelle:
------
Pixabay.com, "Best Buddies" by Kinemesis Music
https://pixabay.com/music/introoutro-best-buddies-12609/


***************************
**   Skripte Vorlesung   **
***************************
- calculateMousePosition.js
- executeKeyAction.js (bearbeitet)
- updateAspectRatio.js
- Physics.js (bearbeitet)

aus den CGA-Vorlesungen
von Prof. Dr. Jan A. Neuhöfer

***************************
**       Fremdcode       **
***************************
rotateAboutPoint(obj, point, axis, theta, pointIsWorld)
JavaScript-Funktion (siehe Turntable.js)

Quelle:
------
Stackoverflow.com, Autor: TheJim01
https://stackoverflow.com/a/42866733 (answered Mar 17 '17 at 20:40; edited Aug 5 '19 at 16:36)
Abruf: 13.01.2022 13:30 Uhr

***************************
**      Floor-Textur     **
***************************
- wood_base.jpg

Quelle: Textures.com, "WoodFine0007"
https://www.textures.com/download/WoodFine0077/122591

***************************
**  Tennisball-Texturen  **
***************************
- TennisBallBump.jpg
- TennisBallColorMap.jpg

Quelle: Github.com, "threex.sportballs" by Jerome Etienne
https://github.com/jeromeetienne/threex.sportballs

