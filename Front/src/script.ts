 document.getElementById('fournisseur')?.addEventListener('change', function () {
    const selectElement = document.getElementById('fournisseur') as HTMLSelectElement;
    const transactionTitles = document.querySelectorAll('.transaction-title') as NodeListOf<HTMLHeadingElement>;
    const selectedFournisseur = selectElement.value;

    transactionTitles.forEach(transactionTitle => {

        transactionTitle.classList.remove('om', 'wv', 'wr', 'cb');

        if (selectedFournisseur === 'om') {
            transactionTitle.classList.add('om');
        } else if (selectedFournisseur === 'wv') {
            transactionTitle.classList.add('wv');
        } else if (selectedFournisseur === 'wr') {
            transactionTitle.classList.add('wr');
        } else if (selectedFournisseur === 'cb') {
            transactionTitle.classList.add('cb');
        }
    })
});

async function showNotification(message: string) {
    const notification = document.getElementById('notification') as HTMLDivElement;
    const notificationMessage = document.getElementById('notificationMessage') as HTMLSpanElement;

    notificationMessage.textContent = message;
    notification.style.display = 'block';

    await new Promise((resolve) => setTimeout(resolve, 3000));

    notification.style.display = 'none';
}


document.getElementById('validerBtn')?.addEventListener('click', async function () {
    const trans_type = document.getElementById('type_transaction') as HTMLSelectElement;
    const selectedValue = trans_type.value;

    if (selectedValue === 'depot') {
        await makeDeposit();
    } else if (selectedValue === 'retrait') {
        await makeRetrait();   
    }else {
        await makeTransfert(); 
    }
});

async function makeTransfert() {
  const destinataireInput = document.getElementById('destinataire') as HTMLInputElement;
  const expediteurInput = document.getElementById('expediteur') as HTMLInputElement;
  const fournisseurInput = document.getElementById('fournisseur') as HTMLInputElement;
  const montantInput = document.getElementById('montant') as HTMLInputElement;

  const data = {
    destinataire: destinataireInput.value,
    expediteur: expediteurInput.value,
    fournisseur: fournisseurInput.value,
    montant: parseInt(montantInput.value, 10)
  };

  try {
    const response = await fetch('http://127.0.0.1:8000/api/transactions/transfert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('La requête a échoué.');
    }

    const responseData = await response.json();
    console.log('Réponse de l\'API:', responseData);
    showNotification('transfert effectué')

  } catch (error) {
    console.error('Erreur lors de la requête API:', error);
  }
}

async function makeDeposit() {
    const destinataireInput = document.getElementById('destinataire') as HTMLInputElement;
    const expediteurInput = document.getElementById('expediteur') as HTMLInputElement;
    const fournisseurSelect = document.getElementById('fournisseur') as HTMLSelectElement;
    const montantInput = document.getElementById('montant') as HTMLInputElement;

    const destinataire = destinataireInput.value;
    const expediteur = expediteurInput.value;
    const fournisseur = fournisseurSelect.value;
    const montant = parseInt(montantInput.value, 10);

    if (!destinataire || !expediteur || !fournisseur || isNaN(montant)) {
        showNotification("Veuillez remplir tous les champs correctement.");
        return;
    }

    try {
        const endpoint = 'http://127.0.0.1:8000/api/transactions/depot';
        const data = { destinataire, expediteur, fournisseur, montant };
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    
        if (response.ok) {
            const responseData = await response.json();
            const message = responseData.message;
            const codeFournisseur = fournisseur.toUpperCase();
            const numeroDestinataire = destinataire;
            const notificationElement = document.getElementById('notification');
            const notificationMessageElement = document.getElementById('notificationMessage');
            
            // Créer la notification avec boutons centrés et bouton de copie
            const notificationHTML = `
                <div class="notification-content">
                    <span class="notification-message">${message}</span>
                    <div class="button-container">
                        <button class="notification-button" id="copyCodeButton">Copier le code</button>
                        <button class="notification-button" id="closeButton">Fermer</button>
                    </div>
                </div>
            `;
            notificationMessageElement.innerHTML = notificationHTML;
            notificationElement.style.display = 'block';
            
            // Gérer l'action du bouton de copie
            const copyCodeButton = document.getElementById('copyCodeButton');
            copyCodeButton.addEventListener('click', () => {
                copyToClipboard(codeFournisseur + ' ' + numeroDestinataire);
                showNotification("Code copié !");
            });
            
            // Gérer l'action du bouton de fermeture
            const closeButton = document.getElementById('closeButton');
            closeButton.addEventListener('click', () => {
                notificationElement.style.display = 'none';
            });
        } else {
            const responseData = await response.json();
            showNotification("Erreur lors du dépôt : " + responseData.error);
        }
    } catch (error) {
        showNotification("Une erreur s'est produite lors du dépôt : " + error.message);
    }
}


// Fonction pour copier le texte dans le presse-papiers
function copyToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
}

// Fonction pour afficher la notification
function _showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    notificationMessage.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 0);
}


async function makeRetrait() {
    const expediteurInput = document.getElementById('expediteur') as HTMLInputElement;
    const fournisseurSelect = document.getElementById('fournisseur') as HTMLSelectElement;
    const montantInput = document.getElementById('montant') as HTMLInputElement;

    const expediteur = expediteurInput.value;
    const fournisseur = fournisseurSelect.value;
    const montant = parseInt(montantInput.value, 10);

    if (!expediteur || !fournisseur || isNaN(montant)) {
        showNotification("Veuillez remplir tous les champs correctement.");
        return;
    }

    try {
        const endpoint = 'http://127.0.0.1:8000/api/transactions/retrait';
        const data = { expediteur, fournisseur, montant };
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

         if (response.ok) {
            const responseData = await response.json();
            showNotification("Retrait réussi : " + responseData.message);
        } else {
            const errorData = await response.json();
            showNotification("Erreur de retrait : " + errorData.message);
        }
    } catch (error) {
        showNotification("Une erreur s'est produite lors du retrait : " + error.message);
    }
}

const trans_type = document.getElementById('type_transaction') as HTMLSelectElement;
const destinataireSection = document.querySelector('.transaction-section.destinataire') as HTMLElement;

trans_type.addEventListener('change', function () {
    const selectedValue = trans_type.value;

    if (selectedValue === 'retrait') {
        destinataireSection.classList.add('hidden');
    } else {
        destinataireSection.classList.remove('hidden');
    }
});

const destinataireInput = document.getElementById('destinataire') as HTMLInputElement;

destinataireInput.addEventListener('input', async function () {
    const numeroDestinataire = destinataireInput.value;
    if (numeroDestinataire) {
        const nomDestinataire = await getNomDestinataire(numeroDestinataire);
        document.getElementById('destinataire_nom')?.setAttribute('value', nomDestinataire);
    }
});

const expediteurInput = document.getElementById('expediteur') as HTMLInputElement;

expediteurInput.addEventListener('input', async function () {
    const numeroExpediteur = expediteurInput.value;
    console.log(numeroExpediteur);
    const nomExpediteur = await getNomExpediteur(numeroExpediteur);

    
    let a = document.getElementById('expediteur_nom') as HTMLInputElement;

   console.log(a);
   if (numeroExpediteur.length == 9) {
    a.value = nomExpediteur
   }
    // if (numeroExpediteur) {

    //     console.log(a);
        
    // }
});

async function getNomDestinataire(numeroDestinataire: string): Promise<string> {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/numClient/${numeroDestinataire}`);
        if (response.ok) {
            const client = await response.json();

            if (client.nom) {
                return client.prenom + ' ' + client.nom;
            } else {
                throw new Error("Le nom du destinataire n'a pas été trouvé.");
            }
        } else {
            throw new Error('Erreur lors de la récupération du nom du destinataire.');
        }
    } catch (error) {
        console.error(error.message);
        return '';
    }
}


async function getNomExpediteur(numeroDestinataire: string): Promise<string> {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/numClient/${numeroDestinataire}`);

        // console.log(response);
        
        if (response.ok) {
            const client = await response.json();

            console.log(client);
            

            if (client.nom) {
                return client.prenom + ' ' + client.nom;
            } else {
                throw new Error("Le nom du destinataire n'a pas été trouvé.");
            }
        } else {
            throw new Error('Erreur lors de la récupération du nom du destinataire.');
        }
    } catch (error) {
        console.error(error.message);
        return '';
    }
}

const infoIcon = document.getElementById('info-icon');
infoIcon?.addEventListener('click', async function () {

  const expediteurInput = document.getElementById('expediteur') as HTMLInputElement;
  const numero = expediteurInput.value;
  console.log(numero);
  
  const transactions = await recupererHistoriqueTransactions(numero);

  if (transactions) {
    mettreAJourContenuModal(transactions);
    afficherModal()
  }
  
});

function afficherModal() {
  const transactionHistoryModal = document.getElementById('transactionHistoryModal');
  if (transactionHistoryModal) {
    (transactionHistoryModal as any).show();
  }
}

async function recupererHistoriqueTransactions(numero: string) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/transClient/${numero}`);
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Impossible de récupérer l'historique des transactions.");
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

function mettreAJourContenuModal(transactions: any) {
  const modalBody = document.querySelector('.modal-body');
  if (modalBody) {
    modalBody.innerHTML = '';

    for (const fournisseur in transactions) {
      if (transactions.hasOwnProperty(fournisseur)) {
        const transactionsFournisseur = transactions[fournisseur];
        if (transactionsFournisseur.length > 0) {
          const sectionFournisseur = document.createElement('div');
          sectionFournisseur.classList.add('transaction-provider');

          const titreFournisseur = document.createElement('h5');
          titreFournisseur.textContent = fournisseur;
          sectionFournisseur.appendChild(titreFournisseur);

          const table = document.createElement('table');
          table.classList.add('table', 'table-striped');

          const tableHeader = document.createElement('thead');
          tableHeader.innerHTML = `
            <tr>
              <th>Montant</th>
              <th>Type</th>
              <th>Code</th>
              <th>Date</th>
            </tr>
          `;
          table.appendChild(tableHeader);

          const tableBody = document.createElement('tbody');

          for (const transaction of transactionsFournisseur) {
            const row = document.createElement('tr');

            const montantCell = document.createElement('td');
            montantCell.textContent = transaction.montant;
            row.appendChild(montantCell);

            const typeCell = document.createElement('td');
            typeCell.textContent = transaction.type_trans;
            row.appendChild(typeCell);

            const codeCell = document.createElement('td');
            codeCell.textContent = transaction.code;
            row.appendChild(codeCell);

            const dateCell = document.createElement('td');
            dateCell.textContent = transaction.date_transaction;
            row.appendChild(dateCell);

            tableBody.appendChild(row);
          }

          table.appendChild(tableBody);
          sectionFournisseur.appendChild(table);

          modalBody.appendChild(sectionFournisseur);
        }
      }
    }
  }
}


const addClient = document.getElementById('addClient') as HTMLButtonElement;
addClient.addEventListener('click', async () => {

    const nomInput = document.getElementById('nom') as HTMLInputElement;
    const prenomInput = document.getElementById('prenom') as HTMLInputElement;
    const telephoneInput = document.getElementById('telephone') as HTMLInputElement;

    const nom = nomInput.value;
    const prenom = prenomInput.value;
    const telephone = telephoneInput.value;

    try {
        const response = await fetch('http://127.0.0.1:8000/api/clients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nom: nom,
                prenom: prenom,
                telephone: telephone,
            }),
        });

        if (response.ok) {
            showNotification('Le client a été ajouté avec succès');
        } else {
            showNotification('Erreur lors de l\'ajout du client');
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout du client :', error);
    }
});

const addCompte = document.getElementById('addCompte') as HTMLButtonElement;
addCompte.addEventListener('click', async () => {

    const fournisseurInput = document.getElementById('four') as HTMLSelectElement;
    const telephoneInput = document.getElementById('phone') as HTMLInputElement;

    const fournisseur = fournisseurInput.value;
    const telephone = telephoneInput.value;

    try {
        const response = await fetch('http://127.0.0.1:8000/api/addCompte', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fournisseur: fournisseur,
                telephone: telephone,
            }),
        });

        if (response.ok) {
            const responseData = await response.json();
            showNotification(responseData.message);
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout du client :', error);
    }
});

const listerComptesBtn = document.querySelector('#listerCompte') as HTMLButtonElement;
const tableBody = document.getElementById('comptesTableBody') as HTMLTableSectionElement;

listerComptesBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/listerCompte');
        if (response.ok) {
            const comptes = await response.json();
            afficherComptesDansTableau(comptes);
        } else {
            console.error('Erreur lors de la récupération des comptes');
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des comptes :', error);
    }
});

const tabs = document.querySelector('.tabs') as HTMLElement;

function afficherComptesDansTableau(comptes: any[]) {
    tableBody.innerHTML = '';
    tabs.style.display = 'block';

    comptes.forEach((compte) => {
        const row = tableBody.insertRow();

        const num_compte = row.insertCell();
        num_compte.textContent = compte.num_compte;

        const solde = row.insertCell();
        solde.textContent = compte.solde;

        const prenomCell = row.insertCell();
        prenomCell.textContent = compte.fournisseur;

        const telephoneCell = row.insertCell();
        telephoneCell.textContent = compte.client_id;

        const etat = row.insertCell();
        etat.textContent = compte.etat;

        const actionCell = row.insertCell();

        const boutonBloquer = document.createElement('button');
        boutonBloquer.textContent = 'Bloquer';
        boutonBloquer.addEventListener('click', () => {
          bloquerCompte(compte.num_compte);
        });

        const boutonDeBloquer = document.createElement('button');
        boutonDeBloquer.textContent = 'Débloquer';
        boutonDeBloquer.addEventListener('click', () => {
          debloquerCompte(compte.num_compte);
        });

        const boutonFermer = document.createElement('button');
        boutonFermer.textContent = 'Fermer';
        boutonFermer.addEventListener('click', ()=>{
          fermerCompte(compte.num_compte);
        })

        actionCell.appendChild(boutonBloquer);
        actionCell.appendChild(boutonDeBloquer);
        actionCell.appendChild(boutonFermer);

    });
}

async function fermerCompte(client_id: string) {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/comptes/fermer/${client_id}`, {
        method: 'GET',
      })
      if (response.ok) {
        showNotification('Compte fermé avec succès')
      }else{
        showNotification('Erreur lors de la fermeture du compte')
      }
      
    } catch (error) {
      console.error('Erreur lors de la fermeture:', error);
      
    }
}

async function bloquerCompte(num_Compte) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/comptes/bloquer/${num_Compte}`, {
            method:'GET',
        });

        if (response.ok) {
            showNotification('Compte bloqué avec succès');
        } else {
            showNotification('Erreur lors du blocage du compte');
        }
    } catch (error) {
        console.error('Erreur lors du blocage du compte:', error);
    }   
}


async function debloquerCompte(numCompte: string) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/debloquerCompte/${numCompte}`, {
            method: 'GET',
        });

        if (response.ok) {
            showNotification('Compte débloqué avec succès');
        } else {
            showNotification('Erreur lors du déblocage du compte');
        }
    } catch (error) {
        console.error('Erreur lors du déblocage du compte:', error);
    }
}

async function annulerTransaction(codeTransaction: string) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/annulerTransaction/${codeTransaction}`, {
            method: 'GET',
        });
        if (response.ok) {
            const responseData = await response.json();
            console.log(responseData);
            
            showNotification(responseData.message);
          } else {
            const errorData = await response.json();
            console.log(errorData);

            showNotification(errorData.message);
          }
    } catch (error) {
        console.error('Erreur lors de l\'annulation de la transaction:', error);
    }
}

async function _recupererHistoriqueTransactions(clientId: string) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/clients/${clientId}/historique-transactions`);
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Impossible de récupérer l'historique des transactions.");
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

const InfoIcon = document.getElementById('info-icon');
infoIcon?.addEventListener('click', async function () {

  const expediteurInput = document.getElementById('expediteur') as HTMLInputElement;
  const numero = expediteurInput.value;
  
  const transactions = await recupererHistoriqueTransactions(numero);

  if (transactions) {
    afficherTransactions(transactions.transactions);
  }

});

function afficherTransactions(transactions: any[]) {
  const tableBody = document.querySelector('#histoTrans');
  console.log(tableBody);
  
  if (tableBody) {
    tableBody.innerHTML = '';

    for (const transaction of transactions) {
      const row = document.createElement('tr');

      const montantCell = document.createElement('td');
      montantCell.textContent = transaction.montant;
      row.appendChild(montantCell);

      const typeCell = document.createElement('td');
      typeCell.textContent = transaction.type_trans;
      row.appendChild(typeCell);

      const codeCell = document.createElement('td');
      codeCell.textContent = transaction.code;
      row.appendChild(codeCell);

      const dateCell = document.createElement('td');
      dateCell.textContent = transaction.date_transaction;
      row.appendChild(dateCell);

      const deleteTrans = document.createElement('button');
      deleteTrans.textContent = "Annuler";
      row.appendChild(deleteTrans);

      deleteTrans.addEventListener('click', () => {
        annulerTransaction(transaction.code);
      });

      tableBody.appendChild(row);
    }
  }
}

const a = document.getElementById('ordreDate') as HTMLSelectElement;
const b = document.getElementById('ordreMontant') as HTMLSelectElement;

a.addEventListener('change', async () => {
  const expediteurInput = document.getElementById('expediteur') as HTMLInputElement;
  const numero = expediteurInput.value;
  const transactions = await recupererHistoriqueTransactions(numero);
  if (transactions) {
    appliquerFiltresDate(transactions);
  }
});

b.addEventListener('change', async() => {
  const expediteurInput = document.getElementById('expediteur') as HTMLInputElement;
  const numero = expediteurInput.value;
  const transactions = await recupererHistoriqueTransactions(numero);
  if (transactions) {
    appliquerFiltresMontant(transactions);
  }
});

async function appliquerFiltresDate(transactions) {
  const byDate = a.value;

  let transactionsFiltrees = [...transactions.transactions];

  if (byDate === 'recent') {
    transactionsFiltrees.sort((a, b) => new Date(b.date_transaction).getTime() - new Date(a.date_transaction).getTime());
  } else if (byDate === 'ancien') {
    transactionsFiltrees.sort((a, b) => new Date(a.date_transaction).getTime() - new Date(b.date_transaction).getTime());
  }

  afficherTransactions(transactionsFiltrees);
}

async function appliquerFiltresMontant(transactions) {
  const byMontant = b.value;

  let transactionsFiltrees = [...transactions.transactions];

  if (byMontant === 'croissant') {
    transactionsFiltrees.sort((a, b) => a.montant - b.montant);
  } else if (byMontant === 'decroissant') {
    transactionsFiltrees.sort((a, b) => b.montant - a.montant);
  }

  afficherTransactions(transactionsFiltrees);
}