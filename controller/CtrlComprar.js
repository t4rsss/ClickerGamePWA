document.querySelectorAll(".upgrade-btn").forEach(btn => {
  btn.addEventListener("click", async () => {
    const categoria = btn.dataset.categoria;
    const index = parseInt(btn.dataset.index);
    const upgrade = upgrades[categoria][index];

    if (btc >= upgrade.preco) {
      btc -= upgrade.preco;

      if (upgrade.repetivel) {
        upgrade.nivel++;
        upgrade.preco = Math.floor(upgrade.preco * 1.5);
      } else {
        upgrade.comprado = true;
      }

      upgrade.efeito();
      atualizarLoja();
      atualizarDisplay();
      salvarProgresso();

      const user = auth.currentUser;
      if (user) {
        const uid = user.uid;
        const compraRef = push(ref(db, `compras/${uid}`));
        await set(compraRef, {
          nomeUpgrade: upgrade.nome,
          valor: upgrade.preco,
          dataCompra: new Date().toISOString()
        });
      }

      buysound.currentTime = 0;
      buysound.play();
    }
  });
});
