import React, { Component } from 'react';
// import ReactGoogleSheets from '../../../utils/react-google-sheets';
var stringSimilarity = require('string-similarity');



class DataComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sheetLoaded: false,
            updatingSpreadsheet: false,
            updateSuccess: false,
        }
        this.sheetName = 'Guest List';
    }

    getSpreadsheetNames(spreadsheetData) {
        return spreadsheetData.data.map(data => {
            const name = data[2];
            return name && name.replace("&", "and");
        });
    }

    getResponseNames() {
        return Object.keys(this.props.files).map(key => {
            const fileData = this.props.files[key];
            const data = JSON.parse(fileData);
            return data;
        })
    }

    setCellData(row, column, content) {
        return {
            range: this.sheetName + '!' + column + row,
            values: [[content]]
        }
    }
    

    getPlateCount(guestData, food) {
        const guestCount = parseInt(guestData.guestsAttending);
        let count = 0;
        for (let guest = 1; guest <= guestCount; guest++) {
            const key = `guest${guest}Food`;
            if (guestData[key] === food) {
                count++;
            }
        }
        return count;  
    }

    getWhoIsEatingWhat(guestData) {
        const guestCount = parseInt(guestData.guestsAttending);
        let foods = "";
        for (let guest = 1; guest <= guestCount; guest++) {
            const food = `guest${guest}Food`;
            const name = `guest${guest}Name`;
            foods += `${guestData[name]}(${guestData[food]}) `;
        }
        return foods;
    }

    updateRSVPS = (updateFn, spreadsheetData) => {
        this.setState({
            updatingSpreadsheet: true,
            updateSuccess: false,
        })
        const fileNames = this.getResponseNames();
        const guestList  = this.getSpreadsheetNames(spreadsheetData);
        const data = [];
        for (let file of fileNames) {
            let match;
            try {
                match = stringSimilarity.findBestMatch(file.guestName, guestList);
            } catch(e) {
                console.log(guestList)
                console.log(e);
                this.setState({
                    error: true,
                })
                return;
            }
            let row = match.bestMatchIndex + 2;
            // attending
            const attending = file.attending === "true" ? 'Yes' : "No";
            data.push(this.setCellData(row, 'B', attending, updateFn));
            // guests Attending
            data.push(this.setCellData(row, 'F', file.guestsAttending || 0));
            const beefCount = this.getPlateCount(file, 'Beef');
            data.push(this.setCellData(row, 'G', beefCount, updateFn));
            const chickenCount = this.getPlateCount(file, 'Chicken');
            data.push(this.setCellData(row, 'H', chickenCount, updateFn));
            const vegieCount = this.getPlateCount(file, 'Vegetarian');
            data.push(this.setCellData(row, 'I', vegieCount, updateFn));
            data.push(this.setCellData(row, 'J', this.getWhoIsEatingWhat(file), updateFn));
        }
        updateFn(
            data,
            () => {
                this.setState({
                    updatingSpreadsheet: false,
                    updateSuccess: true,
                    error: false,
                })
            }, // successCallback
            (error) => {
                console.log('error', error.body)
                this.setState({
                    error: true,
                })
            }
        );
  }

  render() {
      return (
          <p>Spreadsheet Integration coming soon</p>
      )
    // return (
    //   <ReactGoogleSheets 
    //     clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
    //     apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
    //     spreadsheetId={'1-C0ixsVql50BPzoOXf-_huHlnKgw42kV2mLAFRbmxos'}
    //     afterLoading={() => this.setState({sheetLoaded: true})}
    //   >
    //     {this.state.sheetLoaded ? 
    //       <div  style={{marginBottom: '30px'}}>
    //         {/* Access Data */}
    //         {/* Update Data */}
    //         <button
    //             disabled={this.state.updatingSpreadsheet}
    //             onClick={() => {
    //                 this.updateRSVPS(this.props.batchUpdateCell, this.props.getSheetsData('Guest List'));
    //             }}>
    //                 Update RSVP Spreadsheet
    //         </button>
    //         {this.state.error && <span style={{paddingLeft: '15px'}}>Something went wrong, refresh the page.</span>}
    //         {this.state.updateSuccess && <span style={{paddingLeft: '15px'}}>Successfully updated!</span>}
    //         <br/><br/>
    //         <a href="https://docs.google.com/spreadsheets/d/1-C0ixsVql50BPzoOXf-_huHlnKgw42kV2mLAFRbmxos/edit?usp=sharing" target="blank" rel="noopener">Go to spreadsheet</a>
    //       </div>
    //       :
    //       'Loading google spreadsheet...'
    //     }
    //   </ReactGoogleSheets>
    // )
  }
}

export default DataComponent
