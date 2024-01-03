
from flask import Flask
import random

app = Flask(__name__)

countries = ['Egypt','Syria', 'Iran', 'China', 'US', 'UK', 'Brazil', 'zimbabwe']
destinations = ["North", "South", "Center"]

@app.route('/getData')
def getData():
    source = countries[random.randint(0,len(countries) -1)]
    amount = random.randint(1,10)
    destination = destinations[random.randint(0,len(destinations) -1)]
    
    print(f'{source} fired {amount} missiles at {destination}')

    return {"source": source, "missileAmount": amount, "destination": destination}

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=5002)
