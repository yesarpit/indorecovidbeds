const graphCell = (total, vacant, perc) => `
<div class="bar-graph bar-graph-horizontal bar-graph-one">
 <div class="bar-one">
 <span class="year"><span class='bold'>${vacant}</span>/ ${total}</span>
<div class="bar" style='width:${100-perc}%;min-width:4px;height:28px' data-percentage=${100-perc}%></div>
</div>
</div>`


const columnDefs = [
  { field: "hospital", headerName: 'Hospital Availability - Indore', minWidth: 300 },
  {
    field: "bed",
    minWidth: 250,
    // type: 'numericColumn',
    headerName: 'Beds Available',
    comparator: (valueA, valueB, nodeA, nodeB, isInverted) => {
      // console.log(valueA, valueB, Number(valueA.split('/')[1]), Number(valueB.split('/')[1]))
      // if (valueA == valueB) return 0;
      // return (valueA > valueB) ? 1 : -1;
      const totalA = valueA.split('/')[0]
      const vacantA = valueA.split('/')[1]
      const totalB = valueB.split('/')[0]
      const vacantB = valueB.split('/')[1]
      return Number(vacantA) - Number(vacantB)
    },

    cellRenderer: params => {
      // put the value in bold
      //   console.log(params)
      const total = Number(params.value.split('/')[0]);
      const vacant = Number(params.value.split('/')[1]);
      return graphCell(total, vacant, Math.round((total - vacant) / total * 100))
        //   'Value is **' + params.value + '**';

    }

  },
  { field: "contact", minWidth: 650 },
  { field: "updated", minWidth: 150 },

];

const defaultColDef = {
    resizable: true,
    filter: 'agTextColumnFilter',
    sortable: true,
    unSortIcon: true
  }
  // specify the data
let rowData = [
  //   { hospital: "Toyota", contact: "Celica", price: 35000 },
];

// let the grid know which columns and what data to use
const gridOptions = {
  columnDefs: columnDefs,
  rowData: rowData,
  defaultColDef: defaultColDef,
  animateRows: true
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', () => {
  const gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);
})

let doc;
let list = [];

axios
  .get("https://sarthak.nhmmp.gov.in/covid/facility-bed-occupancy-details?show=2000&pagenum=1&district_id=17&facility_org_type=0&facility_type=0", {
    // .get("data.txt", {
    district_id: 17,
    facility_org_type: 0,
    facility_type: 0
  })
  .then(response => {
    doc = new DOMParser().parseFromString(response.data, "text/html");
    extractInfo(doc)

  })
  .catch(error => console.error(error));


// let rowData = [
//   { hospital: "Toyota", contact: "Celica", price: 35000 },
//   { make: "Ford", model: "Mondeo", price: 32000 },
//   { make: "Porsche", model: "Boxter", price: 72000 }
// ];


function extractInfo(doc) {
  const hospitalNameList = doc.querySelectorAll('.hospitalname');
  const contactBodyList = doc.querySelectorAll('.contact-body');
  const lastUpdatedList = doc.querySelectorAll('.last-updated');
  const bedAvailableList = doc.querySelectorAll('.bed-status');

  for (let i = 0; i < hospitalNameList.length; i++) {
    // let item = list[i];
    // hospitalNameList[i].innerText
    rowData.push({ 'hospital': hospitalNameList[i].firstChild.textContent })

    // console.log(hospitalNameList[i]);
  }

  for (let i = 0; i < contactBodyList.length; i++) {
    // let item = list[i];
    // contactBodyList[i].innerText
    rowData[i]['contact'] = contactBodyList[i].innerText;
    // rowData[i]['contact'] = contactBodyList[i].innerText
    // console.log(item);
  }

  for (let i = 0; i < lastUpdatedList.length; i++) {
    // let item = list[i];
    // lastUpdatedList[i].innerText
    // rowData[i]['price'] = lastUpdatedList[i].innerText
    // rowData.push({ 'price': lastUpdatedList[i].innerText })
    rowData[i]['updated'] = lastUpdatedList[1].innerText.split(',')[1].trim()
      // temp1
      // console.log(item);
  }

  for (let i = 0; i < bedAvailableList.length; i++) {
    // let item = list[i];
    // lastUpdatedList[i].innerText
    // rowData[i]['price'] = lastUpdatedList[i].innerText
    // rowData.push({ 'price': lastUpdatedList[i].innerText })
    rowData[i]['bed'] = bedAvailableList[i].innerText;
    // console.log(item);
  }



  //   console.log(list)

  // createTableRows(list)
  // console.log(rowData)

  gridOptions.api.setRowData(rowData);
  gridOptions.api.sizeColumnsToFit()

}




function createTableRows(list) {


}