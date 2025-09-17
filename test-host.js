// Wrap everything and export a factory that accepts deps
(function () {
  function createRemoteLib({ http }) {
    const url = 'https://getghltoken-xxvu4qktma-uc.a.run.app/';

    async function ghlToken() {
      const errors = [];
      const tokens = {};
      try {
        const resp = await http.get(url);
        tokens.ghl = resp.data.ghlToken;
        return { errors, tokens };
      } catch (err) {
        errors.push({ ghlToken: String(err) });
        return { errors, error_messages: JSON.stringify(errors) };
      }
    }

    async function run() {
      const r = await ghlToken();
      if (r.errors?.length) return { success: false, ...r };
      return { success: true, ...r };
    }

    return { run };
  }

  // expose a factory on the global
  globalThis.RemoteLibFactory = { createRemoteLib };
})();
