import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return (
        <div>
            <Header currentUser={currentUser} />
            <div className='container'>
                <Component currentUser={currentUser} {...pageProps} />
            </div>
        </div>);
};

AppComponent.getInitialProps = async (appContext) => {
    //this is for the entire app
    //console.log(appContext);
    const client = buildClient(appContext.ctx);
    const { data } = await client.get('/api/users/currentuser');

    //this will execute the target page getinitialprops
    //main idea, how to execute it when the are two defined (AppComponent and target page)
    let pageProps = {};
    if(appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser);
    }
    
    return {
        pageProps,
        ...data
    };
};

export default AppComponent;