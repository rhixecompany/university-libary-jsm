
const page = () => {

  return (
    <>
      <section className="book-overview">
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-2">
            <div className="aspect-video rounded-xl bg-muted/50" >
              <h2 className="myhi">First</h2>
            </div>
            <div className="aspect-video rounded-xl bg-muted/50" >
              <h2>Second</h2>
            </div>
          </div>
          <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min" >
            <h2>Screen</h2>
          </div>
        </div>
      </section>
    </>
  );
};

export default page;
