const Section = ({ title, children }) => (
  <section className="my-6 px-4 w-full h-full ">
    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{title}</h3>
    <div className="space-y-6"> {/* Changed from grid to vertical stack */}
      {children}
    </div>
  </section>
);

export default Section;
