/**
 * Алгоритм генерации guid
 */
/// Холст 
import React from 'react';
import { Lang } from '../lang.jsx';
import { getObject } from '../Api.jsx';
import { Button, LabeledContent, AreaInput, MaterialList, ListItem, Item, Input } from "../Components/InputAndButton.jsx";
export class Guid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: [],
            count: '1'
        };
    }

    GetGuid = (val) => {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        function s3() {
            return Math.floor((1 + Math.random()) * 0x1000)
                .toString(16)
                .substring(1);
        }
        return `${s4()}${s4()}-${s4()}-4${s3()}-${s4()}-${s4()}${s4()}${s4()}`;
    }

    procc = () => {
        let result = [];
        for (let i = 0; i < this.state.count; i++)
            result.push(this.GetGuid());
        this.setState({
            value: result.join('\n')
        });
    }

    onInputVal = (val, valid, path) => {
        this.setState(getObject(this.state, path, val));
    }

    render() {
        let $this = this;
        return (
            <div className='calc-wrapper'>
                <AreaInput
                    style={{ fontFamily: 'Consolas,Courier New,Courier,monospace' }}
                    label={'result'}
                    value={this.state.value}
                />
                <div className='col-wrapper col-center'>
                    <div className='col element-padding'>
                        <Button
                            onClick={$this.procc}
                            value={Lang('calc')}
                            className='min-screen-100-width' />
                    </div>
                </div>
                <div className='col-wrapper col-center'>
                    <MaterialList
                        title={'settings'}>
                        <ListItem
                            label={'guid_count'}
                            description={'guid_count_description'}
                            className='col-1'>
                            <Input
                                value={$this.state.count}
                                onChange={$this.onInputVal}
                                path='count'
                                regEx='\d+'
                                ignoreInvalidValue={true} />
                        </ListItem>
                    </MaterialList>
                </div>

            </div>
        );
    }
}