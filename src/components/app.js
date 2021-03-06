import React,{
   Component
} from 'react';
import List from "./list";
import Form from "./form";
import './app.scss';

import DataGrid, 
{ 
      Column,
      FilterRow, 
      HeaderFilter, 
      SearchPanel, 
      Pager, 
      Paging
} from 'devextreme-react/data-grid';

import { 
      SelectBox, 
      CheckBox } 
from 'devextreme-react';

import { 
      customers 
} from './data.js';

import { 
      orders 
} from './dataServices.js';

const getOrderDay = (rowData) => {
      return (new Date(rowData.OrderDate)).getDay();
    };

export class App extends Component {

      constructor(props) {
            super(props);
            this.orders = orders;
            this.applyFilterTypes = [{
              key: 'auto',
              name: 'Immediately'
            }, {
              key: 'onClick',
              name: 'On Button Click'
            }];
            this.saleAmountHeaderFilter = [{
              text: 'Less than $3000',
              value: ['SaleAmount', '<', 3000]
            }, {
              text: '$3000 - $5000',
              value: [
                ['SaleAmount', '>=', 3000],
                ['SaleAmount', '<', 5000]
              ]
            }, {
              text: '$5000 - $10000',
              value: [
                ['SaleAmount', '>=', 5000],
                ['SaleAmount', '<', 10000]
              ]
            }, {
              text: '$10000 - $20000',
              value: [
                ['SaleAmount', '>=', 10000],
                ['SaleAmount', '<', 20000]
              ]
            }, {
              text: 'Greater than $20000',
              value: ['SaleAmount', '>=', 20000]
            }];
            this.state = {
              showFilterRow: true,
              showHeaderFilter: true,
              currentFilter: this.applyFilterTypes[0].key
            };
            this.dataGrid = null;
            this.orderHeaderFilter = this.orderHeaderFilter.bind(this);
            this.onShowFilterRowChanged = this.onShowFilterRowChanged.bind(this);
            this.onShowHeaderFilterChanged = this.onShowHeaderFilterChanged.bind(this);
            this.onCurrentFilterChanged = this.onCurrentFilterChanged.bind(this);
          }
          calculateFilterExpression(value, selectedFilterOperations, target) {
            let column = this;
            if (target === 'headerFilter' && value === 'weekends') {
              return [[getOrderDay, '=', 0], 'or', [getOrderDay, '=', 6]];
            }
            return column.defaultCalculateFilterExpression.apply(this, arguments);
          }
          orderHeaderFilter(data) {
            data.dataSource.postProcess = (results) => {
              results.push({
                text: 'Weekends',
                value: 'weekends'
              });
              return results;
            };
          }
          onShowFilterRowChanged(e) {
            this.setState({
              showFilterRow: e.value
            });
            this.clearFilter();
          }
          onShowHeaderFilterChanged(e) {
            this.setState({
              showHeaderFilter: e.value
            });
            this.clearFilter();
          }
          onCurrentFilterChanged(e) {
            this.setState({
              currentFilter: e.value
            });
          }
          clearFilter() {
            this.dataGrid.instance.clearFilter();
          }
          onInitialized(e) {
            e.component.columnOption('SaleAmount', {
              editorOptions: {
                format: 'currency',
                showClearButton: true
              }
            });
          }

   render(){
      return(
         <div>
                 <DataGrid
                        dataSource={customers}
                        columns={['CompanyName', 'City', 'State', 'Phone', 'Fax']}
                        showBorders={true}
                  />
                  <div className="space"/>
                  <DataGrid
                        dataSource={customers}
                        showBorders={true}
                        >
                        <Paging defaultPageSize={10} />
                        <Pager
                        showPageSizeSelector={true}
                        allowedPageSizes={[5, 10, 20]}
                        showInfo={true} />

                        <Column dataField={'CompanyName'} />
                        <Column dataField={'City'} />
                        <Column dataField={'State'} />
                        <Column dataField={'Phone'} />
                        <Column dataField={'Fax'} />
                  </DataGrid>
                  <div className="space"/>
                  <DataGrid id={'gridContainer'}
                        ref={(ref) => this.dataGrid = ref}
                        dataSource={this.orders}
                        onInitialized={this.onInitialized}
                        showBorders={true}>
                        <FilterRow visible={this.state.showFilterRow}
                              applyFilter={this.state.currentFilter} />
                        <HeaderFilter visible={this.state.showHeaderFilter} />
                        <SearchPanel visible={true}
                              width={240}
                              placeholder={'Search...'} />
                        <Column dataField={'OrderNumber'}
                              width={140}
                              caption={'Invoice Number'}
                              headerFilter={{ groupInterval: 10000 }} />
                        <Column dataField={'OrderDate'}
                              alignment={'right'}
                              dataType={'date'}
                              width={120}
                              calculateFilterExpression={this.calculateFilterExpression}
                              headerFilter={{ dataSource: this.orderHeaderFilter }} />
                        <Column dataField={'DeliveryDate'}
                              alignment={'right'}
                              dataType={'datetime'}
                              format={'M/d/yyyy, HH:mm'}
                              width={180} />
                        <Column dataField={'SaleAmount'}
                              alignment={'right'}
                              dataType={'number'}
                              format={'currency'}
                              headerFilter={{ dataSource: this.saleAmountHeaderFilter }} />
                        <Column dataField={'Employee'} />
                        <Column dataField={'CustomerStoreCity'}
                              caption={'City'}
                              headerFilter={{ allowSearch: true }} />
                        </DataGrid>
                        <div className={'options'}>
                        <div className={'caption'}>Options</div>
                        <div className={'option'}>
                              <span>Apply Filter </span>
                              <SelectBox items={this.applyFilterTypes}
                              value={this.state.currentFilter}
                              onValueChanged={this.onCurrentFilterChanged}
                              valueExpr={'key'}
                              displayExpr={'name'}
                              disabled={!this.state.showFilterRow} />
                        </div>
                        <div className={'option'}>
                              <CheckBox text={'Filter Row'}
                              value={this.state.showFilterRow}
                              onValueChanged={this.onShowFilterRowChanged} />
                        </div>
                        <div className={'option'}>
                              <CheckBox text={'Header Filter'}
                              value={this.state.showHeaderFilter}
                              onValueChanged={this.onShowHeaderFilterChanged} />
                        </div>
            </div>
         </div>
      );
   }
}

export default App