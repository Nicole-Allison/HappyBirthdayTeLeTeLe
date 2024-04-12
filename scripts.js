$(document).ready(function(){
  const cake = document.querySelector(".cake");
  const candleCountDisplay = document.getElementById("candleCount");
  const playButton = document.getElementById("play");
  const openLetterButton = document.getElementById("letter");
  const icing = document.querySelector(".icing");
  let backgroundMusic = document.querySelector("audio");

  let candles = [];
  let audioContext;
  let analyser;
  let microphone;

  $('.cake').hide();
  $('.balloon-left').hide();

  $('#turn_on').click(function(){
    backgroundMusic.play();
    $('.balloon-border').animate({top:-500},4300);
    $('body').addClass('peach');
    $(this).fadeOut('slow').delay(2000).promise().done(function(){
        $('.bannar').fadeIn('slow');
        $('.cake').fadeIn(1000);
        $('#play').fadeIn('slow');

        $('.message1').delay(2000).fadeIn('slow').delay(4000).fadeOut('slow', function() {
          $('.message2').fadeIn('slow').delay(3000).fadeOut('slow', function() {
              $('.message3').fadeIn('slow').delay(5000).fadeOut('slow', function() {
                  $('.message4').fadeIn('slow').delay(3000).fadeOut('slow', function() {
                      $('#play').fadeOut('slow', function() {
                          $('#letter').delay(1000).fadeIn('slow');
                          $('.message5').fadeIn('slow');
                      });
                  });
              });
          });
      });
      
    });
});

  $('#letter').click(function(){
    backgroundMusic.pause();
    window.open('https://drive.google.com/file/d/1Rk8rVGiEqejWv_vTBvsCjjGBKZcrxpmz/view?usp=sharing', '_blank');


  });


  function updateCandleCount() {
    const activeCandles = candles.filter(
        (candle) => !candle.classList.contains("out")
    ).length;
    candleCountDisplay.textContent = activeCandles;
}

function addCandle(left, top) {
    const candle = document.createElement("div");
    candle.className = "candle";
    candle.style.left = left + "px";
    candle.style.top = top + "px";

    const flame = document.createElement("div");
    flame.className = "flame";
    candle.appendChild(flame);

    cake.appendChild(candle);
    candles.push(candle);
    updateCandleCount();
}

cake.addEventListener("click", function(event) {
    const rect = cake.getBoundingClientRect();
    const left = event.clientX - rect.left;
    const top = event.clientY - rect.top;
    addCandle(left, top);
});

function isBlowing() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
    }
    let average = sum / bufferLength;

    return average > 40; //
}

function blowOutCandles() {
    let blownOut = 0;

    if (isBlowing()) {
        candles.forEach((candle) => {
            if (!candle.classList.contains("out") && Math.random() > 0.5) {
                candle.classList.add("out");
                blownOut++;
            }
        });
    }

    if (blownOut > 0) {
        updateCandleCount();
    }
}



if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function(stream) {
          audioContext = new(window.AudioContext || window.webkitAudioContext)();
          analyser = audioContext.createAnalyser();
          microphone = audioContext.createMediaStreamSource(stream);
          microphone.connect(analyser);
          analyser.fftSize = 256;
          setInterval(blowOutCandles, 200);
      })
      .catch(function(err) {
          console.log("Unable to access microphone: " + err);
      });
} else {
  console.log("getUserMedia not supported on your browser!");
}

playButton.addEventListener("click", function() {
  // Add 19 candles to the cake
  for (let i = 0; i < 19; i++) {
      // Calculate random coordinates within the icing area
      const left = icing.offsetLeft + Math.random() * (icing.offsetWidth - 24); // Subtracting the candle width
      const top = icing.offsetTop + Math.random() * (icing.offsetHeight - 35); // Subtracting the candle height

      // Add the candle with the corrected coordinates
      addCandle(left, top);
  }
});

});
