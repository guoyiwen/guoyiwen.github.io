app.getForecast = function (key, label) {
  var statement = 'select * from weather.forecast where woeid=' + key;
  var url = 'https://query.yahooapis.com/v1/public/yql?format=json&q=' +
      statement;
  // TODO add cache logic here

  // Fetch the latest data.
  var request = new XMLHttpRequest();
  request.onreadystatechange = function () {
      if (request.readyState === XMLHttpRequest.DONE) {
          if (request.status === 200) {
              var response = JSON.parse(request.response);
              var results = response.query.results;
              results.key = key;
              results.label = label;
              results.created = response.query.created;
              app.updateForecastCard(results);
          }
      } else {
          // Return the fake weather forecast since no data is available.
              app.updateForecastCard(additionalFakeForecasts[key]);
      }
  };
  request.open('GET', url);
  request.send();
};