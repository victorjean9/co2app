import React, { useEffect, useState } from 'react';
import CanvasJSReact from '../assets/canvasjs.react';
import AxiosClient from '../services/AxiosClient';
import Links from '../routes/Links';
import { Segment, Header, Icon, Divider, Form, Button, Statistic, Grid } from 'semantic-ui-react';

import fundo from '../assets/fundo.jpg';
import RiscoService from '../services/RiscoService';

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
                    "Content-type": "Application/json",
                    "Authorization": '60e142711eaf3f50dca37bad'
                }   
            }
        )
        .then(result => {
            console.log(result);
            let medicoesArray = [];
            for (var i = 0; i < result.data.length; i++) {
                let medicao = [];

                let co2 = result.data[i].medicao;
                let timestamp = result.data[i].data;
                let idSensor = result.data[i].idSensor;
                let risco = result.data[i].risco;
                let riscoSemMascara = result.data[i].riscoSemMascara;
                let riscoComPff2 = result.data[i].riscoComPff2;

                medicao.push(co2);
                medicao.push(timestamp);
                medicao.push(idSensor);
                medicao.push(risco);
                medicao.push(riscoSemMascara);
                medicao.push(riscoComPff2);

                medicoesArray.push(medicao);
            }
            // setMedicoes(medicoesArray);

            props.setMedicoes(medicoesArray);

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
            axisY: {
				title: "CO₂"
			},
            axisX: {
				title: "Tempo"
			},
            data: [{
                type: "area",
                xValueType: "dateTime",
                dataPoints: dataPoints
            }]
        });

        props.setLoading(false);
    }

    return (
        <Segment loading={props.loading}>
            <Header as='h4'>
                <Icon name='area graph' />
                Gráfico do CO₂
            </Header>
            <Divider />
            <CanvasJSChart options={options}/>
        </Segment>
    );
}

const GraficoRiscoSegment = (props) => {

    let [options, setOptions] = useState({});
    // let [medicoes, setMedicoes] = useState([]);

    useEffect(() => {
        if(props.medicoes !== [] && props.medicoes !== undefined){
            carregaGrafico();
        }
        // carregaValores();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.medicoes]);

    const carregaGrafico = () => {
        let dataPointsComMascara = [];
        let dataPointsComPff2 = [];
        let dataPointsSemMascara = [];

        for(let i = 0; i < props.medicoes.length; i++) {
            let risco = props.medicoes[i][3];
            let riscoSemMascara = props.medicoes[i][4];
            let riscoComPff2 = props.medicoes[i][5];
            let timestamp = props.medicoes[i][1];

            let dateRaw = new Date(timestamp);

            let date = dateRaw.getTime();

            dataPointsComMascara.push({x: date, y: parseFloat(risco.toFixed(1))});
            dataPointsComPff2.push({x: date, y: parseFloat(riscoComPff2.toFixed(1))});
            dataPointsSemMascara.push({x: date, y: parseFloat(riscoSemMascara.toFixed(1))});
        }

        // console.log(dataPoints);

        setOptions({
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            animationEnabled: true,
            zoomEnabled: true,
            axisY: {
				title: "Probabilidade",
				suffix: "%"
			},
            axisX: {
				title: "Tempo"
			},
            data: [{
                name: "Sem máscara",
                showInLegend: true,
                color: "#e57373",
                type: "area",
                xValueType: "dateTime",
                dataPoints: dataPointsSemMascara
            }, {
                name: "Com máscara de pano",
                showInLegend: true,
                color: "green",
                type: "area",
                xValueType: "dateTime",
                dataPoints: dataPointsComMascara
            }, {
                name: "Com máscara PFF2",
                showInLegend: true,
                color: "blue",
                type: "area",
                xValueType: "dateTime",
                dataPoints: dataPointsComPff2
            }]
        });

        props.setLoading(false);
    }

    return (
        <Segment loading={props.loading}>
            <Header as='h4'>
                <Icon name='area graph' />
                Gráfico do Risco
            </Header>
            <Divider />
            <CanvasJSChart options={options}/>
        </Segment>
    );
}

const FiltrosSegment = (props) => {
    let [sensor, setSensor] = useState('610102bde69bd84020a30f52');
    
    let [dia, setDia] = useState(0);
    let [ateDia, setAteDia] = useState(0);
    let [mes, setMes] = useState(0);

    let optionsSensores = [
        { key: '610102bde69bd84020a30f52', text: 'Sensor Principal', value: '610102bde69bd84020a30f52' },
        { key: '610597435877da09d494531c', text: 'Sensor Secundário', value: '610597435877da09d494531c' }
    ];

    let optionsMeses = [
        { key: 0, text: '---', value: 0 },
        { key: 6, text: 'Junho', value: 6 },
        { key: 7, text: 'Julho', value: 7 },
        { key: 8, text: 'Agosto', value: 8 },
        { key: 9, text: 'Setembro', value: 9 },
        { key: 10, text: 'Outubro', value: 10 },
        { key: 11, text: 'Novembro', value: 11 },
        { key: 12, text: 'Dezembro', value: 12 }
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
        props.setSensor(sensor);

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
        <>
            <Header as="h4">
                <Icon name="filter" />
                <Header.Content>Filtrar medições</Header.Content>
            </Header>
            <Form>
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
                <Button content='Filtrar' icon='filter' labelPosition='right' onClick={() => enviaFiltro()} loading={props.loading}/>
            </Form>
        </>
    );
}

const RiscoSegment = (props) => {
    // let [taxaCoIn, setTaxaCoIn] = useState("");
    let [quanta, setQuanta] = useState(25);
    let [numeroInfectados, setNumeroInfectados] = useState(1);
    let [tempo, setTempo] = useState(2);
    let [ocupantes, setOcupantes] = useState(20);

    const calculaRisco = (medicoes) => {
        props.setQuanta(quanta);
        props.setNumeroInfectados(numeroInfectados);
        props.setTempo(tempo);
        props.setOcupantes(ocupantes);

        recalculaRiscoDados(medicoes, numeroInfectados, tempo, ocupantes, quanta);
    }

    const recalculaRiscoDados = (medicoes, numeroInfectados = 1, tempo = 2, ocupantes = 20, quanta = 25) => {
        // props.setLoading(true);

        let medicoesArray = [];

        medicoes.forEach(registro => {
            registro[3] = RiscoService.calculaRisco(registro[0], numeroInfectados, tempo, ocupantes, quanta);
            registro[4] = RiscoService.calculaRisco(registro[0], numeroInfectados, tempo, ocupantes, quanta, false);
            registro[5] = RiscoService.calculaRisco(registro[0], numeroInfectados, tempo, ocupantes, quanta, true, 0.95);
            medicoesArray.push(registro);
        });

        props.setMedicoes(medicoesArray);
        // props.setLoading(false);
    }

    return(
        <>
            <Divider />
            <Header as="h4">
                <Icon name="edit" />
                <Header.Content>Calcular Risco</Header.Content>
            </Header>
            <Form>
                <Form.Input fluid label='Quanta' value={quanta} onChange={(e, {value}) => setQuanta(value)} />
                {/* <Form.Input fluid label='Taxa de CO2 interno' value={taxaCoIn} onChange={(e, {value}) => setTaxaCoIn(value)} /> */}
                
                <Form.Input fluid label='Numero de infectados' value={numeroInfectados} onChange={(e, {value}) => setNumeroInfectados(value)} />
                <Form.Input fluid label='Tempo' value={tempo} onChange={(e, {value}) => setTempo(value)} />
                <Form.Input fluid label='Ocupantes' value={ocupantes} onChange={(e, {value}) => setOcupantes(value)} />
                <Button content='Calcular' icon='arrow right' labelPosition='right' onClick={() => calculaRisco(props.medicoes)} loading={props.loading}/>
            </Form>
        </>
    );
}

const RiscoAoVivo = (props) => {

    const filtroSemMascara = 0;
    const filtroComMascara = 0.5;
    const filtroComPFF2 = 0.95;

    let [riscoSemMascara, setRiscoSemMascara] = useState(0);
    let [riscoComMascara, setRiscoComMascara] = useState(0);
    let [riscoComPFF2, setRiscoComPFF2] = useState(0);

    let [intervalo, setIntervalo] = useState();
    let [contInt, setContInt] = useState(0);

    useEffect(() => {
        if(props.idSensor !== 0){
            if(contInt !== 0) {
                clearInterval(intervalo);
            }

            setContInt(contInt + 1);

            carregaRiscos();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.idSensor, props.numeroInfectados, props.tempo, props.ocupantes, props.quanta]);
    
    const carregaRiscos = () => {
        AxiosClient.get(
            Links.medicao + props.idSensor,
            {
                headers: {
                    "Content-type": "Application/json",
                    "Authorization": '60e142711eaf3f50dca37bad'
                }
            }
        )
        .then(result => {

            let riscoSM = RiscoService.calculaRisco(result.data.medicao, props.numeroInfectados, props.tempo, props.ocupantes, props.quanta, false, filtroSemMascara);
            let riscoCM = RiscoService.calculaRisco(result.data.medicao, props.numeroInfectados, props.tempo, props.ocupantes, props.quanta, true, filtroComMascara);
            let riscoCPff2 = RiscoService.calculaRisco(result.data.medicao, props.numeroInfectados, props.tempo, props.ocupantes, props.quanta, true, filtroComPFF2);

            setRiscoSemMascara(Math.round(riscoSM));
            setRiscoComMascara(Math.round(riscoCM));
            setRiscoComPFF2(Math.round(riscoCPff2));

            let interval = setInterval(carregaRiscos, 60000); 
            setIntervalo(interval);
        });
    }

    return(
        <Segment loading={props.loading}>
            <Header as="h4">
                <Icon name="time" />
                <Header.Content>Risco Ao-Vivo</Header.Content>
            </Header>
            <Divider />
            <Statistic.Group size="tiny" widths='three'>
                <Statistic>
                    <Statistic.Label>Risco sem máscara</Statistic.Label>
                    <Statistic.Value>{riscoSemMascara ? riscoSemMascara + "%" : "-"}</Statistic.Value>
                </Statistic>
                <Statistic>
                    <Statistic.Label>Risco com máscara de pano</Statistic.Label>
                    <Statistic.Value>{riscoComMascara ? riscoComMascara + "%" : "-"}</Statistic.Value>
                </Statistic>
                <Statistic>
                    <Statistic.Label>Risco com máscara Pff2</Statistic.Label>
                    <Statistic.Value>{riscoComPFF2 ? riscoComPFF2 + "%" : "-"}</Statistic.Value>
                </Statistic>
            </Statistic.Group>
        </Segment>
    );
}

const MenuVertical = (props) => {

    return(
        <Segment>
            {props.children}
        </Segment>
    );
}

const HomePage = (props) => {
    
    let [loading, setLoading] = useState(false);

    let [sensor, setSensor] = useState('610102bde69bd84020a30f52');

    let [filtro, setFiltro] = useState();
    let [medicoes, setMedicoes] = useState([]);

    let [quanta, setQuanta] = useState(25);
    let [numeroInfectados, setNumeroInfectados] = useState(1);
    let [tempo, setTempo] = useState(2);
    let [ocupantes, setOcupantes] = useState(20);

    return(
        <div style={{background: "url(" + fundo +")", backgroundSize: "100%"}}>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <Grid columns='equal' style={{margin: "0px 15px"}}>
                <Grid.Column>
                    <MenuVertical>
                        <FiltrosSegment 
                            loading={loading} setLoading={setLoading} 
                            sensor={sensor}
                            setSensor={setSensor}

                            filtro={filtro}
                            setFiltro={setFiltro}
                        />
                        <RiscoSegment 
                            loading={loading} setLoading={setLoading} 
                            setMedicoes={setMedicoes}
                            medicoes={medicoes}
                            filtro={filtro}

                            quanta={quanta} setQuanta={setQuanta}
                            numeroInfectados={numeroInfectados} setNumeroInfectados={setNumeroInfectados}
                            tempo={tempo} setTempo={setTempo}
                            ocupantes={ocupantes} setOcupantes={setOcupantes}

                        />
                    </MenuVertical>
                </Grid.Column>
                <Grid.Column width={13}>
                    <RiscoAoVivo 
                        loading={loading} setLoading={setLoading} 
                        idSensor={sensor}

                        quanta={quanta} setQuanta={setQuanta}
                        numeroInfectados={numeroInfectados} setNumeroInfectados={setNumeroInfectados}
                        tempo={tempo} setTempo={setTempo}
                        ocupantes={ocupantes} setOcupantes={setOcupantes}
                    />
                    <GraficoRiscoSegment 
                        loading={loading} 
                        setLoading={setLoading} 
                        medicoes={medicoes}
                    />
                    <GraficoSegment 
                        loading={loading} setLoading={setLoading}
                        setMedicoes={setMedicoes}
                        filtro={filtro}
                    />
                </Grid.Column>
            </Grid>
        </div>
    );
}

export default HomePage;