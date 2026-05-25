import { ContactDetailsPage } from './components/layout/ContactDetailsPage';
import { ContactProvider } from './context/ContactContext';
import { useContactPage } from './hooks/useContactPage';
import './App.css';

function App() {
  const { data, loading, error, layoutVariant, switchLayout, refetch } =
    useContactPage();

  if (loading) {
    return (
      <div className="app-state">
        <div className="spinner" aria-hidden />
        <p>Loading contact details...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="app-state app-state--error">
        <p>{error ?? 'Something went wrong'}</p>
        <button type="button" className="btn btn--primary" onClick={refetch}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <ContactProvider key={layoutVariant} data={data}>
      <ContactDetailsPage
        layoutVariant={layoutVariant}
        onSwitchLayout={switchLayout}
      />
    </ContactProvider>
  );
}

export default App;
