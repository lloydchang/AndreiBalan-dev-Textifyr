import matplotlib.font_manager as fm

# Get a list of all available fonts
available_fonts = set(f.name for f in fm.fontManager.ttflist)

# Check if specific fonts are available
desired_fonts = ["Proxima Nova Bl"]

for font in desired_fonts:
    if font in available_fonts:
        print(f"Font '{font}' is available on your system.")
    else:
        print(f"Font '{font}' is NOT available on your system.")

