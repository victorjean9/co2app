import React, { useEffect, useState } from 'react';
import CanvasJSReact from '../assets/canvasjs.react';
import AxiosClient from '../services/AxiosClient';
import Links from '../routes/Links';
import { Segment, Container, Header, Icon, Divider, Dimmer, Loader, Form, Button } from 'semantic-ui-react';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const GraficoSegment = (props) => {

    let [options, setOptions] = useState({});
    // let [medicoes, setMedicoes] = useState([]);

    useEffect(() => {
        if(props.filtro !== undefined){
            carregaValores();
        }
        // carregaValores();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.filtro]);

    const carregaValores = () => {
        props.setLoading(true);
        AxiosClient.post(
            Links.medicoes,
            props.filtro,
            {
                headers: {
                    "Access-Control-Allow-Origin" : "*",
                    "Content-type": "Application/json",
                    "Authorization": '60e142711eaf3f50dca37bad'
                }   
            }
        )
        .then(result => {
            let medicoesArray = [];
            for (var i = 0; i < result.data.length; i++) {
                let medicao = [];

                let co2 = result.data[i].medicao;
                let timestamp = result.data[i].data;
                let idSensor = result.data[i].idSensor;

                medicao.push(co2);
                medicao.push(timestamp);
                medicao.push(idSensor);

                medicoesArray.push(medicao);
            }
            // setMedicoes(medicoesArray);

            carregaGrafico(medicoesArray);
        });
    }

    const carregaGrafico = (medicoes) => {
        let dataPoints = [];

        for(let i = 0; i < medicoes.length; i++) {
            let co2 = medicoes[i][0];
            let timestamp = medicoes[i][1];

            let dateRaw = new Date(timestamp);

            let date = dateRaw.getTime();

            dataPoints.push({x: date, y: parseFloat(co2)});
            
        }

        // console.log(dataPoints);

        setOptions({
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            animationEnabled: true,
            zoomEnabled: true,
            data: [{
                type: "area",
                xValueType: "dateTime",
                dataPoints: dataPoints
            }]
        });

        props.setLoading(false);
    }

    return (
        <Segment>
            <Dimmer active={props.loading} inverted>
                <Loader inverted>Carregando</Loader>
            </Dimmer>
            <div>
                <Header as="h2" >
                    <Icon name="area graph" />
                    <Header.Content>Gráfico</Header.Content>
                </Header>
                <Divider />
                <CanvasJSChart options={options}/>
            </div>
        </Segment>
    );
}

const FiltrosSegment = (props) => {

    let [sensor, setSensor] = useState('610102bde69bd84020a30f52');
    let [dia, setDia] = useState(0);
    let [ateDia, setAteDia] = useState(0);
    let [mes, setMes] = useState(0);

    let optionsSensores = [
        { key: '610102bde69bd84020a30f52', text: '610102bde69bd84020a30f52', value: '610102bde69bd84020a30f52' },
        { key: '610597435877da09d494531c', text: '610597435877da09d494531c', value: '610597435877da09d494531c' }
    ];

    let optionsMeses = [
        { key: 0, text: '---', value: 0 },
        { key: 6, text: 'Junho', value: 6 },
        { key: 7, text: 'Julho', value: 7 },
        { key: 8, text: 'Agosto', value: 8 }
    ];

    let [optionsDias, setOptionsDias] = useState([]);

    useEffect(() => {
        let diasArray = [{ key: 0, text: "---", value: 0 }];
        let i = 1;
        while(i <= 31) {
            let option = { key: i, text: i, value: i }
            diasArray.push(option);
            i++;
        }
        setOptionsDias(diasArray)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const enviaFiltro = () => {

        if(mes === 0){
            let filtro = {
                idSensor: sensor
            };

            props.setFiltro(filtro);
        } else {

            let diaAux = dia < 10 ? "0" + dia : dia;
            let ateDiaAux = dia < 10 ? "0" + ateDia : ateDia;
            let mesAux = mes < 10 ? "0" + mes : mes;

            let diaFormatado = "2021-" + mesAux + "-" + diaAux + "T00:00:00.000-03:00";
            let ateDiaFormatado = "2021-" + mesAux + "-" + diaAux + "T23:59:00.000-03:00";

            if(dia === 0) {
                diaFormatado = "2021-" + mesAux + "-01T00:00:00.000-03:00";
                ateDiaFormatado = "2021-" + mesAux + "-31T23:59:00.000-03:00";
            } else {
                if(ateDia !== 0) {
                    ateDiaFormatado = "2021-" + mesAux + "-" + ateDiaAux + "T23:59:00.000-03:00";
                }
            }
            
            let filtro = {
                idSensor: sensor,
                from: diaFormatado,
                to: ateDiaFormatado
            };

            props.setFiltro(filtro);
        }
    }

    return(
        <Segment>
            <Header as="h2">
                <Icon name="filter" />
                <Header.Content>Filtrar medições</Header.Content>
            </Header>
            <Divider />
            <Form>
                <Form.Group widths='equal'>
                    <Form.Select
                        fluid
                        label='Sensor:'
                        options={optionsSensores}
                        value={sensor}
                        onChange={(e, {value}) => setSensor(value)} 
                    />
                    <Form.Select
                        fluid
                        label='Do dia:'
                        options={optionsDias}
                        value={dia}
                        onChange={(e, {value}) => setDia(value)} 
                    />
                        <Form.Select
                        fluid
                        label='Até o dia:'
                        options={optionsDias}
                        value={ateDia}
                        onChange={(e, {value}) => setAteDia(value)} 
                    />
                    <Form.Select
                        fluid
                        label='Mês:'
                        options={optionsMeses}
                        value={mes}
                        onChange={(e, {value}) => setMes(value)} 
                    />
                </Form.Group>
                <Button content='Filtrar' icon='filter' labelPosition='right' onClick={() => enviaFiltro()} loading={props.loading}/>
            </Form>
                
        </Segment>
    );
}

const HomePage = (props) => {
    
    let [loading, setLoading] = useState(false);

    let [filtro, setFiltro] = useState();

    return(
        <Container>
            <br/>
            <Header as="h1" icon textAlign='center'>
                <Icon name="thermometer half" circular/>
                <Header.Content>Medidor CO2</Header.Content> 
            </Header>
            <br/>
            <FiltrosSegment 
                loading={loading}

                setFiltro={setFiltro}
            />
            <GraficoSegment 
                loading={loading} setLoading={setLoading} 

                filtro={filtro}
            />
            <br/>
        </Container>
    );
}

export default HomePage;