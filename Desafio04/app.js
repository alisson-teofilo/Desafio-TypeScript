"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let apiKey, requestToken, username, password, sessionId, contaId, selectIdList;
const loginButton = document.getElementById('login-button'), searchContainer = document.getElementById('search-container'), selectContainer = document.getElementById('select-container'), criaList = document.getElementById('criaList'), mostrarListas = document.getElementById('mostrar-Listas'), mostrarMinhasListas = document.getElementById('minhas-listas'), templateFilme1 = document.querySelector('.templatefilme'), templateFilme = templateFilme1.content, fragment = document.createDocumentFragment();
const templateLista1 = document.querySelector('.templateLista'), templateLista = templateLista1.content, fragmentLista = document.createDocumentFragment(), minhasListasGeral = document.querySelector('#minhas-listas');
const templateVerLista1 = document.querySelector('.templateVerLista'), templateVerLista = templateVerLista1.content, fragmentVerLista = document.createDocumentFragment(), verListaContainer = document.querySelector('#ver-lista');
let selectList = searchContainer.querySelector('.selectList');
function preencherSenha() {
    let password1 = document.getElementById('senha');
    password = password1.value;
    validateLoginButton();
}
function preencherLogin() {
    let username1 = document.getElementById('login');
    username = username1.value;
    validateLoginButton();
}
function preencherApi() {
    let apiKey1 = document.getElementById('api-key');
    apiKey = apiKey1.value;
}
function validateLoginButton() {
    if (password && username) {
        loginButton.disabled = false;
    }
    else {
        loginButton.disabled = true;
    }
}
function update() {
    selectIdList = selectList.options[selectList.selectedIndex].value;
    console.log(selectIdList);
    return selectIdList;
}
class HttpClient {
    static get(response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let body;
                let request = new XMLHttpRequest();
                request.open(response.method, response.url, true);
                request.onload = () => {
                    if (request.status >= 200 && request.status < 300) {
                        resolve(JSON.parse(request.responseText));
                    }
                    else {
                        reject({
                            status: request.status,
                            statusText: request.statusText
                        });
                    }
                };
                request.onerror = () => {
                    reject({
                        status: request.status,
                        statusText: request.statusText
                    });
                };
                if (response.body) {
                    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    body = JSON.stringify(response.body);
                }
                request.send(body);
            });
        });
    }
}
function criarRequestToken() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`,
            method: "GET"
        });
        requestToken = result.request_token;
    });
}
function logar() {
    return __awaiter(this, void 0, void 0, function* () {
        yield HttpClient.get({
            url: `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${apiKey}`,
            method: "POST",
            body: {
                username: `${username}`,
                password: `${password}`,
                request_token: `${requestToken}`
            }
        });
    });
}
function criarSessao() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}&request_token=${requestToken}`,
            method: "GET"
        });
        sessionId = result.session_id;
        searchContainer.style.display = "block";
        criaList.style.display = "block";
        mostrarListas.style.display = "block";
    });
}
function contaDetails() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/account?api_key=${apiKey}&session_id=${sessionId}`,
            method: "GET"
        });
        contaId = result.id;
    });
}
function procurarFilme(query) {
    return __awaiter(this, void 0, void 0, function* () {
        query = encodeURI(query);
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`,
            method: "GET"
        });
        selectContainer.style.display = "block";
        return result;
    });
}
function criarLista(nomeDaLista, descricao) {
    return __awaiter(this, void 0, void 0, function* () {
        yield HttpClient.get({
            url: `https://api.themoviedb.org/3/list?api_key=${apiKey}&session_id=${sessionId}`,
            method: "POST",
            body: {
                name: `${nomeDaLista}`,
                description: `${descricao}`,
                language: "pt-br"
            }
        });
    });
}
function adicionarFilmeNaLista(filmeId, listaId) {
    return __awaiter(this, void 0, void 0, function* () {
        listaId = encodeURI(listaId);
        yield HttpClient.get({
            url: `https://api.themoviedb.org/3/list/${listaId}/add_item?api_key=${apiKey}&session_id=${sessionId}`,
            method: "POST",
            body: {
                media_id: filmeId
            }
        });
    });
}
function pegarListasDaConta() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/account/${contaId}/lists?api_key=${apiKey}&session_id=${sessionId}`,
            method: "GET"
        });
        mostrarMinhasListas.style.display = "block";
        return result;
    });
}
function eliminarLista(listaId) {
    return __awaiter(this, void 0, void 0, function* () {
        listaId = encodeURI(listaId);
        console.log("Eliminar", listaId);
        yield HttpClient.get({
            url: `https://api.themoviedb.org/3/list/${listaId}?api_key=${apiKey}&session_id=${sessionId}`,
            method: "DELETE"
        });
    });
}
function verLista(listaId) {
    return __awaiter(this, void 0, void 0, function* () {
        listaId = encodeURI(listaId);
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/list/${listaId}?api_key=${apiKey}`,
            method: "GET"
        });
        verListaContainer.style.display = "block";
        let tbody = verListaContainer.querySelector("tbody");
        tbody.innerHTML = "";
        let h3Span = verListaContainer.querySelector("h3 span");
        h3Span.textContent = result.name;
        let h4 = verListaContainer.querySelector("h4");
        h4.textContent = result.description;
        let eflb = templateVerLista.querySelector(".eliminarFilmeListBtn");
        eflb.dataset.idLista = result.id;
        for (const item of result.items) {
            let vfn = templateVerLista.querySelector(".verFilmeNome");
            vfn.textContent = item.original_title;
            let vfd = templateVerLista.querySelector(".verFilmeDescricao");
            vfd.textContent = item.overview;
            let vfda = templateVerLista.querySelector(".verFilmeData");
            vfda.textContent = item.release_date;
            eflb.dataset.idFilme = item.id;
            let $cloneVerLista = document.importNode(templateVerLista, true);
            fragmentVerLista.appendChild($cloneVerLista);
        }
        tbody.appendChild(fragmentVerLista);
    });
}
function eliminarFilmeNaLista(filmeId, listaId) {
    return __awaiter(this, void 0, void 0, function* () {
        listaId = encodeURI(listaId);
        yield HttpClient.get({
            url: `https://api.themoviedb.org/3/list/${listaId}/remove_item?api_key=${apiKey}&session_id=${sessionId}`,
            method: "POST",
            body: {
                media_id: filmeId
            }
        });
    });
}
document.addEventListener('click', (e) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const target = e.target;
    if (target.matches("#login-button")) {
        yield criarRequestToken();
        yield logar();
        yield criarSessao();
        yield contaDetails();
    }
    if (target.matches("#search-button")) {
        let tbody = searchContainer.querySelector("tbody");
        tbody.innerHTML = "";
        selectList.innerHTML = "";
        let query = document.getElementById('search');
        let queryText = query.value;
        let listaDeFilmes = yield procurarFilme(queryText);
        let selectMinhasListas = yield pegarListasDaConta();
        for (let ls of selectMinhasListas.results) {
            let optionList = document.createElement('option');
            optionList.value = ls.id;
            optionList.appendChild(document.createTextNode(ls.name));
            selectList.appendChild(optionList);
        }
        for (const item of listaDeFilmes.results) {
            let fi = templateFilme.querySelector(".filmeId");
            fi.textContent = item.id;
            let fn = templateFilme.querySelector(".filmeNome");
            fn.textContent = item.original_title;
            let afb = templateFilme.querySelector(".adicionarFilmeBtn");
            afb.dataset.idFilme = item.id;
            let $clone = document.importNode(templateFilme, true);
            fragment.appendChild($clone);
        }
        (_a = searchContainer.querySelector("tbody")) === null || _a === void 0 ? void 0 : _a.appendChild(fragment);
        query.value = " ";
    }
    if (target.matches("#criaList-button")) {
        let nomeDaLista = document.querySelector('#name-list');
        let nomeDaListaText = nomeDaLista.value.toUpperCase();
        let descricao = document.querySelector('#description');
        let descricaoText = descricao.value;
        yield criarLista(nomeDaListaText, descricaoText);
        nomeDaLista.value = "";
        descricao.value = "";
    }
    if (target.matches(".adicionarFilmeBtn")) {
        let filmeId = target.dataset.idFilme;
        let listaId = update();
        console.log(filmeId, listaId);
        yield adicionarFilmeNaLista(filmeId, listaId);
        yield verLista(listaId);
    }
    if (target.matches("#list-button")) {
        let tbody = minhasListasGeral.querySelector("tbody");
        tbody.innerHTML = "";
        let listDetails = yield pegarListasDaConta();
        for (const item of listDetails.results) {
            let lit = templateLista.querySelector(".listaIdTemplate");
            lit.textContent = item.id;
            let lnt = templateLista.querySelector(".listaNomeTemplate");
            lnt.textContent = item.name;
            let vlb = templateLista.querySelector(".verListaBtn");
            vlb.dataset.idLista = item.id;
            let elb = templateLista.querySelector(".eliminarListaBtn");
            elb.dataset.idLista = item.id;
            let $cloneLista = document.importNode(templateLista, true);
            fragmentLista.appendChild($cloneLista);
        }
        console.log(listDetails.results);
        tbody === null || tbody === void 0 ? void 0 : tbody.appendChild(fragmentLista);
    }
    if (target.matches(".verListaBtn")) {
        let listaId = target.dataset.idLista;
        console.log(listaId);
        yield verLista(listaId);
    }
    if (target.matches(".eliminarListaBtn")) {
        let listaIdGeral = target.dataset.idLista;
        yield eliminarLista(listaIdGeral);
    }
    if (target.matches(".eliminarFilmeListBtn")) {
        let filmeId = target.dataset.idFilme;
        let listaId = target.dataset.idLista;
        yield eliminarFilmeNaLista(filmeId, listaId);
    }
}));
