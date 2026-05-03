export default function Loader() {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black" data-testid="site-loader">
            <div className="gb-loader" />
            <p className="mt-6 font-display tracking-[0.5em] text-neon-red text-sm uppercase">Loading GameBrew</p>
        </div>
    );
}
